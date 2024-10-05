"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datepicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { FormEventHandler, useEffect, useState } from "react";
import { useMap } from "./maps/mapProvider";
import { motion } from "framer-motion";
import Zod from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LabelWrapper } from "@/components/ui/input";

const tabs = ["acquisition", "historic"] as const;

const formValidator = Zod.object({
  email: Zod.string().email(),
  latitude: Zod.coerce.number().min(-90).max(90),
  longitude: Zod.coerce.number().min(-180).max(180),
  lead_time: Zod.coerce.number().int().min(1).max(8).optional(),
  max_cloud_cover: Zod.number().int().min(0).max(100).default(99),
  span_end_time: Zod.date().optional(),
  span_start_time: Zod.date().optional(),
  type: Zod.enum(tabs),
});

type TFormSchema = Zod.infer<typeof formValidator>;

export default function Form() {
  const { map, lngLat, setLngLat, mapContainerId } = useMap();
  const [isExpanded, setExpanded] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    formState,
    setValue,
    getValues,
    watch,
  } = useForm<TFormSchema>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      max_cloud_cover: 100,
    },
  });

  console.log("formState", formState);

  const cloudness = watch("max_cloud_cover");

  useEffect(() => {
    if (lngLat.lng !== getValues("longitude")) {
      setValue("longitude", lngLat.lng);
    }

    if (lngLat.lat !== getValues("latitude")) {
      setValue("latitude", lngLat.lat);
    }
  }, [lngLat.lng, lngLat.lat]);

  const onSubmit = (data: TFormSchema) => {
    console.log("data", data);
    // const notificationDetails = `${leadTime} day${leadTime > 1 ? "s" : ""} before the event`;
    // let acquisitionDetails;
    // switch (acquisitionType) {
    //   case "most-recent":
    //     acquisitionDetails = "Most recent acquisition";
    //     break;
    //   case "time-span":
    //     acquisitionDetails = `Acquisitions from ${startDate} to ${endDate}`;
    //     break;
    //   case "historical":
    //     acquisitionDetails = `Historical data from ${historicalDate}`;
    //     break;
    // }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-none">
      <CardHeader>
        <CardTitle>Space Crammers</CardTitle>
        <CardDescription>
          Get notified when Landsat satellites pass over your location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <input type="hidden" {...register("type")} />
            <Label htmlFor="map">Select Location on Map</Label>
            <motion.div
              initial={{ height: 200 }}
              animate={{ height: isExpanded ? window.innerHeight - 100 : 200 }}
              transition={{ duration: 0.25 }}
              id={mapContainerId}
              onAnimationComplete={() => map?.resize()}
            />
            <div className="w-full flex justify-center">
              <Button
                type="button"
                disabled={!map}
                onClick={() => {
                  setExpanded((prev) => !prev);
                }}
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LabelWrapper label="Latitude">
              <Input
                id="latitude"
                min={-90}
                max={90}
                type="number"
                step="any"
                placeholder="e.g. 37.7749"
                {...register("latitude")}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setValue("latitude", value);
                  if (value > 90 || value < -90) return;
                  setLngLat({
                    ...lngLat,
                    lat: value,
                  });
                }}
              />
            </LabelWrapper>
            <LabelWrapper label="Longitude">
              <Input
                id="longitude"
                min={-180}
                max={180}
                type="number"
                step="any"
                placeholder="e.g. -122.4194"
                {...register("longitude")}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setValue("longitude", value);
                  if (value > 180 || value < -180) return;
                  setLngLat({
                    ...lngLat,
                    lng: value,
                  });
                }}
              />
            </LabelWrapper>
          </div>
          <div className="space-y-2">
            <LabelWrapper label={`Maximum Cloud Cover (${cloudness}%)`}>
              <Controller
                name="max_cloud_cover"
                control={control}
                render={({ field }) => (
                  <Slider
                    onChange={(event) => {
                      field.onChange(event);
                    }}
                    defaultValue={[100]}
                    step={1}
                  />
                )}
              />
            </LabelWrapper>
          </div>
          <div className="space-y-2">
            <LabelWrapper label="Email for Notifications">
              <Input
                id="email"
                type="email"
                placeholder="crammers@space.org"
                {...register("email")}
              />
            </LabelWrapper>
          </div>

          <Tabs
            onValueChange={(value: string) => {
              // @ts-expect-error: everything is a string
              setValue("type", value);
            }}
            defaultValue="acquisition"
          >
            <TabsList
              onSelect={(event) => {
                console.log("Changed", event);
              }}
              className="mb-3"
            >
              <TabsTrigger value="acquisition">Next satellite pass</TabsTrigger>
              <TabsTrigger value="historic">
                Historic satellite passes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="acquisition">
              <LabelWrapper label="Notification Lead Time (days)">
                <Input
                  id="leadTime"
                  type="number"
                  min="1"
                  {...register("lead_time")}
                />
              </LabelWrapper>
            </TabsContent>
            <TabsContent value="historic">
              <div className="flex gap-5 flex-wrap">
                <LabelWrapper label="Start Date">
                  <Controller
                    name="span_start_time"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        date={field.value}
                        onSelect={(date) => setValue("span_start_time", date)}
                      ></DatePicker>
                    )}
                  />
                </LabelWrapper>
                <LabelWrapper label="End Date">
                  <Controller
                    name="span_end_time"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        date={field.value}
                        onSelect={(date) => setValue("span_end_time", date)}
                      ></DatePicker>
                    )}
                  />
                </LabelWrapper>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full">
            Set Up Notifications
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

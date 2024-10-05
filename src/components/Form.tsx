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
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { useMap } from "../app/maps/mapProvider";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LabelWrapper } from "@/components/ui/input";
import { formSchema, tabs, type TFormSchema } from "@/app/schemes/formSchema";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Form() {
  const { map, lngLat, setLngLat, mapContainerId } = useMap();
  const [isExpanded, setExpanded] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      max_cloud_cover: 100,
    },
  });

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
                variant={"ghost"}
                type="button"
                disabled={!map}
                onClick={() => {
                  setExpanded((prev) => !prev);
                }}
              >
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LabelWrapper error={errors.latitude?.message} label="Latitude">
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
            <LabelWrapper error={errors.longitude?.message} label="Longitude">
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
            <LabelWrapper
              error={errors.max_cloud_cover?.message}
              label={`Maximum Cloud Cover (${cloudness}%)`}
            >
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
            <LabelWrapper
              error={errors.email?.message}
              label="Email for Notifications"
            >
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
              <LabelWrapper
                error={errors.lead_time?.message}
                label="Notification Lead Time (days)"
              >
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
                <LabelWrapper
                  error={errors.span_start_time?.message}
                  label="Start Date"
                >
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
                <LabelWrapper
                  error={errors.span_end_time?.message}
                  label="End Date"
                >
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

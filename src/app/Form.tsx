"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { FormEventHandler, useState } from "react";
import { useMap } from "./maps/mapProvider";
import { motion } from 'framer-motion';
import Zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const formValidator = Zod.object({
  cloudCover: Zod.number().int().min(0).max(100),
  email: Zod.string().email(),
  leadTime: Zod.number().int().min(1),
  acquisitionType: Zod.enum(["most-recent", "time-span", "historical"]),
  startDate: Zod.string().optional(),
  endDate: Zod.string().optional(),
  historicalDate: Zod.string().optional(),
  lng: Zod.number().min(-180).max(180),
  lat: Zod.number().min(-90).max(90),
});

type FormValues = Zod.infer<typeof formValidator>;

export default function Form() {
  // const [cloudCover, setCloudCover] = useState(50);
  // const [email, setEmail] = useState("");
  // const [leadTime, setLeadTime] = useState(1);
  // const [emailError, setEmailError] = useState("");
  // const [acquisitionType, setAcquisitionType] = useState("most-recent");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  // const [historicalDate, setHistoricalDate] = useState("");
  const { map, lngLat, setLngLat, mapContainerId } = useMap();
  const [isExpanded, setExpanded] = useState(false);

  const { handleSubmit, register, getValues } = useForm<FormValues>({
    resolver: zodResolver(formValidator),
    defaultValues: {
      endDate: new Date().toISOString(),
      cloudCover: 50,
      lng: lngLat.lng,
      lat: lngLat.lat,
    }
  })

  const onSubmit = (data: FormValues) => {
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

  const { cloudCover, leadTime, acquisitionType, startDate, endDate, historicalDate } = getValues();

  return (
    <Card className="w-full max-w-4xl mx-auto border-none">
      <CardHeader>
        <CardTitle>Landsat 8/9 Notification Service</CardTitle>
        <CardDescription>
          Get notified when Landsat satellites pass over your location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
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
                }}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                placeholder="e.g. 37.7749"
                {...register('lat')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="e.g. -122.4194"
                {...register('lng')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cloudCover">Maximum Cloud Cover (%)</Label>
            <Slider
              min={0}
              max={100}
              step={1}
              {...register('cloudCover')}
            />
            <div className="text-sm text-muted-foreground">{cloudCover}%</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email for Notifications</Label>
            <Input
              id="email"
              type="email"
              placeholder="crammers@space.org"
              {...register('email')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadTime">Notification Lead Time (days)</Label>
            <Input
              id="leadTime"
              type="number"
              min="1"
              value={leadTime}
              onChange={(e) => setLeadTime(parseInt(e.target.value) || 1)}
              className="w-20"
            />
          </div>
          <div className="space-y-4">
            <Label>Landsat Acquisition Preference</Label>
            <RadioGroup {...register('acquisitionType')} >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="most-recent" id="most-recent" />
                <Label htmlFor="most-recent">Most Recent Acquisition</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time-span" id="time-span" />
                <Label htmlFor="time-span">Specific Time Span</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="historical" id="historical" />
                <Label htmlFor="historical">Historical Data</Label>
              </div>
            </RadioGroup>
            {acquisitionType === "time-span" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
            {acquisitionType === "historical" && (
              <div className="space-y-2">
                <Label htmlFor="historicalDate">Historical Date</Label>
                <Input
                  id="historicalDate"
                  type="date"
                  value={historicalDate}
                  onChange={(e) => setHistoricalDate(e.target.value)}
                />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Set Up Notifications
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

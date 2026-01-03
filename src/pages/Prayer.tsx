import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  day: string;
  month: { en: string; ar: string };
  year: string;
}

interface LocationInfo {
  city: string;
  country: string;
}

const Prayer: React.FC = () => {
  const { t, isEnglish } = useLanguage();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async (lat: number, lon: number) => {
      try {
        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=2`
        );
        const data = await response.json();

        if (data.code === 200) {
          setPrayerTimes(data.data.timings);
          setHijriDate(data.data.date.hijri);
        } else {
          setError('Failed to load prayer times');
        }
      } catch (err) {
        setError('Failed to fetch prayer times');
      } finally {
        setLoading(false);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Reverse geocoding
            try {
              const geoResponse = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const geoData = await geoResponse.json();
              setLocation({
                city: geoData.city || geoData.locality || 'Unknown',
                country: geoData.countryName || 'Unknown',
              });
            } catch {
              setLocation({ city: 'Unknown', country: 'Unknown' });
            }

            fetchPrayerTimes(latitude, longitude);
          },
          () => {
            // Default to Dhaka if location access denied
            setLocation({ city: 'Dhaka', country: 'Bangladesh' });
            fetchPrayerTimes(23.8103, 90.4125);
          }
        );
      } else {
        // Default to Dhaka
        setLocation({ city: 'Dhaka', country: 'Bangladesh' });
        fetchPrayerTimes(23.8103, 90.4125);
      }
    };

    getLocation();
  }, []);

  const prayerList = prayerTimes ? [
    { name: t('prayer.fajr'), time: prayerTimes.Fajr, icon: Moon, color: 'text-indigo-500' },
    { name: t('prayer.sunrise'), time: prayerTimes.Sunrise, icon: Sunrise, color: 'text-orange-400' },
    { name: t('prayer.dhuhr'), time: prayerTimes.Dhuhr, icon: Sun, color: 'text-yellow-500' },
    { name: t('prayer.asr'), time: prayerTimes.Asr, icon: Sun, color: 'text-amber-500' },
    { name: t('prayer.maghrib'), time: prayerTimes.Maghrib, icon: Sunset, color: 'text-orange-500' },
    { name: t('prayer.isha'), time: prayerTimes.Isha, icon: Moon, color: 'text-purple-500' },
  ] : [];

  const getNextPrayer = () => {
    if (!prayerTimes) return null;
    
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayerList) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > currentMinutes) {
        return prayer;
      }
    }
    return prayerList[0]; // Fajr for next day
  };

  const nextPrayer = getNextPrayer();

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-500/10 mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('prayer.title')}
          </h1>
          {location && (
            <div className="flex items-center justify-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location.city}, {location.country}</span>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="max-w-md mx-auto space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && prayerTimes && (
          <div className="max-w-md mx-auto space-y-6">
            {/* Current Time & Date */}
            <Card className="overflow-hidden">
              <div className="bg-primary text-primary-foreground p-6 text-center">
                <p className="text-4xl font-bold mb-2">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
                <p className="opacity-90">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              {hijriDate && (
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="arabic-text text-lg">
                      {hijriDate.day} {hijriDate.month.ar} {hijriDate.year}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {hijriDate.day} {hijriDate.month.en} {hijriDate.year} AH
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Next Prayer */}
            {nextPrayer && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    {isEnglish ? 'Next Prayer' : 'পরবর্তী নামাজ'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-primary/10`}>
                        <nextPrayer.icon className={`h-5 w-5 ${nextPrayer.color}`} />
                      </div>
                      <span className="text-xl font-bold text-foreground">
                        {nextPrayer.name}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {nextPrayer.time}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Prayer Times */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {isEnglish ? "Today's Prayer Times" : 'আজকের নামাজের সময়সূচি'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {prayerList.map((prayer) => (
                  <div 
                    key={prayer.name}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      nextPrayer?.name === prayer.name 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <prayer.icon className={`h-5 w-5 ${prayer.color}`} />
                      <span className="font-medium text-foreground">
                        {prayer.name}
                      </span>
                    </div>
                    <span className={`font-semibold ${
                      nextPrayer?.name === prayer.name ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {prayer.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Prayer;

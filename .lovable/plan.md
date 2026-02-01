

# Playback Speed Control for Quran Audio

## Overview
Add a playback speed control feature that allows users to adjust the audio recitation speed. The control will appear as an icon button next to the Play All button, which opens a popover with speed options.

## User Experience

**Speed Options:**
- 0.5x (slow - for learning/memorization)
- 0.75x (slightly slower)
- 1x (normal speed - default)
- 1.25x (slightly faster)
- 1.5x (fast)

**Interaction Flow:**
1. User sees a gauge/speed icon next to "Play All" button
2. Clicking the icon opens a popover with speed options
3. Current speed is visually highlighted
4. Selecting a speed immediately applies it to the audio
5. Speed preference persists during the session

## Technical Implementation

### Files to Modify

**1. src/pages/SurahReader.tsx**

Add new state and handler:
```text
const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

const handleSpeedChange = (speed: number) => {
  setPlaybackSpeed(speed);
  if (audioRef.current) {
    audioRef.current.playbackRate = speed;
  }
};
```

Apply speed when creating new audio:
```text
// In playFromVerse function, after creating audio:
audio.playbackRate = playbackSpeed;
```

Add imports:
```text
import { Gauge } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
```

Add UI next to Play All button:
```text
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="icon" className="gap-1">
      <Gauge className="h-4 w-4" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-40 p-2">
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground mb-2 px-2">
        {isEnglish ? 'Speed' : 'গতি'}
      </p>
      {[0.5, 0.75, 1, 1.25, 1.5].map((speed) => (
        <Button
          key={speed}
          variant={playbackSpeed === speed ? "default" : "ghost"}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSpeedChange(speed)}
        >
          {speed}x
        </Button>
      ))}
    </div>
  </PopoverContent>
</Popover>
```

### Changes Summary

| Location | Change |
|----------|--------|
| State | Add `playbackSpeed` state initialized to `1` |
| Handler | Add `handleSpeedChange` function to update speed and apply to audio |
| `playFromVerse` | Set `audio.playbackRate = playbackSpeed` after creating audio |
| UI (header) | Add speed control popover next to Play All button |
| Imports | Add `Gauge` icon and `Popover` components |

### UI Placement

The speed control will be placed in the surah header section, next to the "Play All" button:

```text
[ Play All ] [ Gauge icon ] ... Playing verse X/Y
```

When clicked, a compact popover opens with the 5 speed options as buttons, with the current speed highlighted.


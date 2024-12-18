import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider'; 

const Player = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1); 
  const [currentTrackTitle, setCurrentTrackTitle] = useState('');

  const [tracks] = useState([
    {
      title: 'Radiohead - No Surprises',
      artist: 'Radiohead',
      audio: require('../assets/Radiohead - No Surprises.mp3'),
    },
    {
      title: 'Chris Brown - Next to You',
      artist: 'Chris Brown',
      audio: require('../assets/Chris Brown - Next To You ft. Justin Bieber.mp3'),
    },
    {
      title: 'Coldplay - Fix You',
      artist: 'Coldplay',
      audio: require('../assets/Coldplay - Fix You.mp3'),
    },
    {
      title: 'Coldplay - The Scientist',
      artist: 'Coldplay',
      audio: require('../assets/Coldplay - The Scientist.mp3'),
    },
    {
      title: 'Lord Huron - Love Like Ghost',
      artist: 'Lord Huron',
      audio: require('../assets/Lord Huron - Love Like Ghosts .mp3'),
    },
    {
      title: 'Lord Huron - The Night We Met',
      artist: 'Lord Huron',
      audio: require('../assets/Lord Huron - The Night We Met.mp3'),
    },
    {
      title: 'Lord Huron - In The Woods',
      artist: 'Lord Huron',
      audio: require('../assets/Meet Me In The Woods.mp3'),
    },
    {
      title: 'Ghost - Mary On A Cross',
      artist: 'Ghost',
      audio: require('../assets/Ghost - Mary On A Cross.mp3'),
    },
    {
      title: 'Pamungkas - To The Bone',
      artist: 'Pamungkas',
      audio: require('../assets/Pamungkas - To The Bone.mp3'),
    },
    {
      title: 'Rob Deniel - Ulap',
      artist: 'Rob Deniel',
      audio: require('../assets/Rob Deniel - Ulap.mp3'),
    },
    {
      title: 'Cigarettes After Sex - Sunsetz',
      audio: require('../assets/Cigarettes After Sex - Sunsetz.mp3'),
    },
    {
      title: 'Cigarettes After Sex - Cry',
      audio: require('../assets/Cigarettes After Sex - Cry.mp3'),
    },
    {
      title: 'Cigarettes After Sex - Apocalypse',
      audio: require('../assets/Cigarettes After Sex - Apocalypse.mp3'),
    },
    {
      title: 'LANY - You!',
      audio: require('../assets/LANY - You!.mp3'),
    },
    {
      title: 'LANY - Super Far',
      audio: require('../assets/LANY - Super Far.mp3'),
    },
    {
      title: 'LANY - Thick and Thin',
      audio: require('../assets/LANY - Thick and Thin.mp3'),
    },
    {
      title: 'LANY - ILYSB',
      audio: require('../assets/LANY - ILYSB.mp3'),
    },
    {
      title: 'LANY - Malibu Night',
      audio: require('../assets/LANY - Malibu Night.mp3'),
    },
    {
      title: 'LANY - 13',
      audio: require('../assets/LANY - 13.mp3'),
    },
    {
      title: 'Cigarettes After Sex - Heavenly',
      audio: require('../assets/Cigarettes After Sex - Heavenly.mp3'),
    },
  ]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        tracks[currentTrackIndex].audio 
      );
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      await newSound.setVolumeAsync(volume); 

      
      setCurrentTrackTitle(tracks[currentTrackIndex].title); 

    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const handlePause = async () => {
    if (sound) {
      await sound.pauseAsync(); 
      setIsPlaying(false);
    }
  };

  const handlePlay = async () => {
    if (sound) {
      try {
        await sound.playAsync(); 
      } catch (error) {
        console.error("Error resuming playback:", error);
      }
      setIsPlaying(true);
    } else {
      playSound(); 
    }
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prevIndex) => {
      let newIndex = prevIndex - 1;
      if (newIndex < 0) {
        newIndex = tracks.length - 1;
      }
      return newIndex;
    });
    playSound();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prevIndex) => {
      let newIndex = prevIndex + 1;
      if (newIndex >= tracks.length) {
        newIndex = 0;
      }
      return newIndex;
    });
    playSound();
  };

  const handleVolumeChange = async (newVolume) => {
    if (sound) {
      await sound.setVolumeAsync(newVolume); 
    }
    setVolume(newVolume);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.en}>Enjoy listening here in MobiFy!</Text> 
     <Image source={require('../assets/album.jpg')} style={styles.al} /> 

      <Text style={styles.songTitle}>{currentTrackTitle || '--No Track--'}</Text> 

      <View style={styles.controls}>
        <TouchableOpacity> 
          <Ionicons name="heart" size={30} color="red" /> 
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePrevious}>
          <Ionicons name="play-skip-back" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={isPlaying ? handlePause : handlePlay}> 
          {isPlaying ? (
            <Ionicons name="pause" size={40} color="black" />
          ) : (
            <Ionicons name="play" size={40} color="black" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="play-skip-forward" size={30} color="black" />
        </TouchableOpacity>
        <Slider 
          style={{ width: 100 }}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={volume}
          onValueChange={handleVolumeChange}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007d92', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  en:{
    color: 'white',
    top: '5%',
    fontSize: 15,
    fontWeight: 'bold'
  },
  al:{
    width: 280, 
    height: 280, 
    marginTop: '20%',
    borderRadius: 30, 
  },
  songTitle: {
    fontSize: 18,
    marginTop: '10%', 
    textAlign: 'center', 
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    backgroundColor: 'white', 
    padding: 15,
    margin: 10,
    marginTop: '5%',
    borderRadius: 10,
  },
});

export default Player;
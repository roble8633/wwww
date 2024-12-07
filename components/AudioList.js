import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { Audio } from 'expo-av'; 
import { Ionicons } from '@expo/vector-icons'; 

const AudioList = () => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTrackTitle, setCurrentTrackTitle] = useState(''); 
  const [tracks, setTracks] = useState([
    {
      title: 'Radiohead - No Surprises',
      audio: require('../assets/Radiohead - No Surprises.mp3'),
    },
    {
      title: 'Chris Brown - Next to You',
      audio: require('../assets/Chris Brown - Next To You ft. Justin Bieber.mp3'),
    },
    {
      title: 'Coldplay - Fix You',
      audio: require('../assets/Coldplay - Fix You.mp3'),
    },
    {
      title: 'Coldplay - The Scientist',
      audio: require('../assets/Coldplay - The Scientist.mp3'),
    },
    {
      title: 'Lord Huron - Love Like Ghost',
      audio: require('../assets/Lord Huron - Love Like Ghosts .mp3'),
    },
    {
      title: 'Lord Huron - The Night We Met',
      audio: require('../assets/Lord Huron - The Night We Met.mp3'),
    },
    {
      title: 'Lord Huron - In The Woods',
      audio: require('../assets/Meet Me In The Woods.mp3'),
    },
    {
      title: 'Ghost - Mary On A Cross',
      audio: require('../assets/Ghost - Mary On A Cross.mp3'),
    },
    {
      title: 'Pamungkas - To The Bone',
      audio: require('../assets/Pamungkas - To The Bone.mp3'),
    },
    {
      title: 'Rob Deniel - Ulap',
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async (audio, index) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(audio);
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
    setCurrentTrackIndex(index);
    setCurrentTrackTitle(tracks[index].title); 

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        playNextTrack(); 
      }
    });
  };

  const playNextTrack = () => {
    if (currentTrackIndex !== null && currentTrackIndex < tracks.length - 1) {
      const nextTrackIndex = currentTrackIndex + 1;
      playSound(tracks[nextTrackIndex].audio, nextTrackIndex);
    } else {
      setIsPlaying(false); 
      setCurrentTrackTitle(''); 
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };
  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };
  const handlePause = async () => {
    if(sound){
      await sound.pauseAsync();
      setIsPlaying(false);
    } 
  };
  const handlePlay = async () => {
    if(sound){
      await sound.playAsync();
      setIsPlaying(true);
    } 
  };


  const shuffleTracks = () => {
    const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
    setTracks(shuffledTracks);
    const randomTrackIndex = Math.floor(Math.random() * shuffledTracks.length);
    playSound(shuffledTracks[randomTrackIndex].audio, randomTrackIndex);
  };
  useEffect(() => {
    setCurrentTrackTitle(tracks[currentTrackIndex]?.title);
  }, [currentTrackIndex, tracks]);

  const handleMenuPress = (index) => {
    setSelectedTrackIndex(index);
    setModalVisible(true);
  };

  const handlePlayNext = () => {
    if (selectedTrackIndex !== null) {
      const nextTrack = tracks[selectedTrackIndex].audio;
      playSound(nextTrack, selectedTrackIndex);
      setModalVisible(false);
    }
  };

  const handleDelete = () => {
    if (selectedTrackIndex !== null) {
      if (selectedTrackIndex === currentTrackIndex) {
        if (sound) {
          sound.unloadAsync(); 
        }
        setCurrentTrackIndex(null);
        setIsPlaying(false);
        setCurrentTrackTitle(''); 
      }
      
      const newTracks = tracks.filter((_, index) => index !== selectedTrackIndex);
      setTracks(newTracks);
      setModalVisible(false);
    }
  };

  const renderTrackItem = ({ item, index }) => (
    <View style={styles.trackItem}>
      <TouchableOpacity onPress={() => playSound(item.audio, index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.trackText}>
          {index + 1}. {item.title}
        </Text>
        {currentTrackIndex === index && (
          <Ionicons name="musical-notes" size={20} color="black" style={styles.playIcon} />
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleMenuPress(index)}>
        <Ionicons name="ellipsis-vertical" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio List</Text>
      <TouchableOpacity onPress={shuffleTracks} style={styles.shuffleButton}>
        <Ionicons name="shuffle" size={30} color="black" />
      </TouchableOpacity>
      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.trackList}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Options</Text>
          <Pressable style={styles.button} onPress={handlePlayNext}>
            <Text style={styles.buttonText}>Play</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
          {isPlaying && selectedTrackIndex === currentTrackIndex && (
            <Pressable style={styles.button} onPress={pauseSound}>
              <Text style={styles.buttonText}>Pause</Text>
            </Pressable>
          )}
          {selectedTrackIndex === currentTrackIndex && !isPlaying && (
            <Pressable style={styles.button} onPress={resumeSound}>
              <Text style={styles.buttonText}>Resume</Text>
            </Pressable>
          )}
          <Pressable style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

     
      <View style={styles.nowPlayingContainer}>
        <Text style={styles.nowPlayingText}>Now Playing:</Text>
        <View style={styles.currentTrackContainer}>
        <TouchableOpacity onPress={handlePause}>
          {isPlaying ? (
            <Ionicons name="pause" size={40} color="black" />
          ) : (
            <Ionicons name="play" size={40} color="black" onPress={handlePlay} />
          )}
          </TouchableOpacity>
        <Text style={styles.currentTrackTitle}>{currentTrackTitle || 'None'}</Text>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#007d92',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignItems: 'center',
    textAlign: 'center',
    color: 'white'
  },
  shuffleButton: {
    alignItems: 'left',
    marginBottom: 10,
    marginLeft: 10,
  },
  trackList: {
    marginBottom: 20,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  trackText: {
    fontSize: 18,
  },
  modalView: {
    marginTop: 200,
    margin: 20,
    backgroundColor: '#66A5AD',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: '#007d92',
    marginVertical: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF4D4D',
  },
  nowPlayingContainer: {
    marginTop: 5,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
  }, 
  nowPlayingText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  currentTrackTitle: {
    fontSize: 14,
    color: '#333',
  },
  trackText: {
    fontSize: 16,
    flex: 1, 
  },
  playIcon: {
    marginLeft: 20,
  },
  currentTrackContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  iconSpacing: {
    marginRight: 10,
    marginBottom: 5,
  },
});

export default AudioList;
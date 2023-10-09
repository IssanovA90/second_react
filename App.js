import React, { useState, useEffect, useCallback } from "react";
import { Button, View, ScrollView, TouchableOpacity, ActivityIndicator, Text, ImageBackground } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem("images");
        if (storedImages !== null) {
          setImages(JSON.parse(storedImages));
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    loadImages();
  }, []);

  const saveImagesToStorage = useCallback(async (newImages) => {
    try {
      await AsyncStorage.setItem("images", JSON.stringify(newImages));
    } catch (error) {
      console.error("Error saving images:", error);
    }
  }, []);

  const pickImage = async () => {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,

      });
      console.log(result);
      if (!result.cancelled) {
        const uri = result.assets[0].uri;
        const newImages = [...images, { src: uri, name: 'Image Name', id: Date.now().toString() }];
        setImages(newImages);
        await saveImagesToStorage(newImages);
        console.log(newImages);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = (imageId) => {
    const newImages = images.filter((image) => image.id !== imageId);
    setImages(newImages);
    saveImagesToStorage(newImages);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ alignItems: "center", justifyContent: "center", marginTop: 100, }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView>
          {images.map((image) => (
            <TouchableOpacity
              key={image.id}
              onLongPress={() => deleteImage(image.id)}
              style={{ marginBottom: 10 }}
            >
              <Text>название картинки</Text>
              <Text>{image.name} </Text>
              <ImageBackground
                source={{ uri: image.src }}
                style={{ width: 200, height: 200 }}
              >
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

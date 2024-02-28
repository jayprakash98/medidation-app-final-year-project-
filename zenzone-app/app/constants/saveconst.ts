import { Platform } from "react-native";
import RNFS from "react-native-fs";

export const AppFolder = "Meditation App";
const AppFolderPath =
  Platform.OS === "ios"
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;

if (!RNFS.exists(AppFolderPath)) {
  RNFS.mkdir(AppFolderPath);
}

export const DirectoryPath = AppFolderPath + "/" + AppFolder;

if (!RNFS.exists(DirectoryPath)) {
  RNFS.mkdir(DirectoryPath);
}

export const AudioDirectoryPath = AppFolderPath + "/" + AppFolder + "/audio";

if (!RNFS.exists(AudioDirectoryPath)) {
  RNFS.mkdir(AudioDirectoryPath);
}

export const filePath = DirectoryPath + "/" + "alldownloadedMusic" + ".json";

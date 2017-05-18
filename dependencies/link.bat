rmdir "..\node_modules\react-native-audio"
rmdir "..\node_modules\react-native-fs"
rmdir "..\node_modules\react-native-progress"
 
mklink /J "..\node_modules\react-native-audio" "react-native-audio"
mklink /J "..\node_modules\react-native-fs" "react-native-fs"
mklink /J "..\node_modules\react-native-progress" "react-native-progress"
 
pause

import * as Haptics from 'expo-haptics';

function haptics(distance) {
  if (distance == 0) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  } else {
    console.log("distance", distance)
  }
}

import cv2
from ultralytics import YOLO
import numpy as np
import math
from PIL import Image
from io import BytesIO

hazards = {
    ("person", 0.45),
    ("bicycle", 0.6),
    ("car", 1.8),
    ("motorcycle", 0.8),
    ("bus", 2.55),
    ("truck", 2.5),
    ("fire hydrant", 0.3),
    ("stop sign", 0.75),
    ("parking meter", 0.3),
    ("bench", 1.5),
    ("cat", 0.2),
    ("dog", 0.3),
    ("sports ball", 0.22),
    ("skateboard", 0.2),
    ("chair", 0.5),
    ("couch", 2),
    ("potted plant", 0.3),
    ("bed", 1.5),
    ("dining table", 1.2),
    ("handbag", 0.3),
}


# Load the model
yolo = YOLO("yolov8s.pt")

# Load the video capture
# videoCap = cv2.VideoCapture(0)

frame_width = 1864  # pix
horizontal_fov = 69  # degrees
# focal_length = 0.026  # mm


def get_distance(object_width_px, real_width):
    focal_length = 3226
    distance_m = (real_width * focal_length) / object_width_px

    return distance_m


def is_in_center(x1, x2):

    middle_start = frame_width // 3
    middle_end = 2 * frame_width // 3

    if x2 > middle_start and x1 < middle_end:
        return True
    return False


# Function to get class colors
def getColours(cls_num):
    base_colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
    color_index = cls_num % len(base_colors)
    increments = [(1, -2, 1), (-2, 1, -1), (1, -1, 2)]
    color = [
        base_colors[color_index][i]
        + increments[color_index][i] * (cls_num // len(base_colors)) % 256
        for i in range(3)
    ]
    return tuple(color)


def get_angle(x1, x2):
    object_center_x = (x1 + x2) / 2
    frame_center_x = frame_width / 2
    horizontal_offset_px = object_center_x - frame_center_x
    pixels_per_degree = frame_width / horizontal_fov
    angle_deg = horizontal_offset_px / pixels_per_degree

    return angle_deg


def get_hazards(file_bytes):

    np_img = np.frombuffer(file_bytes, np.uint8)

    # Decode the NumPy array into an OpenCV image
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
  
    results = yolo.track(frame, stream=True)

    for result in results:
        # get the classes names
        classes_names = result.names
        hazard_dict = []
        # iterate over each box
        for box in result.boxes:
            # check if confidence is greater than 40 percent
            if box.conf[0] > 0.4:
                # get coordinates
                [x1, y1, x2, y2] = box.xyxy[0]
                # convert to int
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                # get the class
                cls = int(box.cls[0])

                # get the class name
                class_name = classes_names[cls]
                real_width = 0
                dist = 0
                for name, value in hazards:
                    if is_in_center(x1, x2):
                        if class_name == name:
                            real_width = value
                            print("x2", x2, "x1", x1)
                            dist = get_distance(x2 - x1, real_width)
                            angle = get_angle(x1, x2)

                            hazard_dict.append(
                                (class_name, dist, (x1, y1, x2, y2), angle)
                            )
                        else:
                            continue
                    else:
                        continue

                # get the respective colour
                colour = getColours(cls)

                # draw the rectangle
                cv2.rectangle(frame, (x1, y1), (x2, y2), colour, 2)

                # put the class name and confidence on the image
                cv2.putText(
                    frame,
                    f"{classes_names[int(box.cls[0])]} {dist:.2f} {x1, y1, x2, y2}",
                    (x1, y1),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1,
                    colour,
                    2,
                )


    if hazard_dict:
        closest_hazard = min(hazard_dict, key=lambda x: x[1])
        if closest_hazard:
            if (closest_hazard[2][0] + closest_hazard[2][2]) / 2 < frame_width / 2:

                print(
                    f"Closest hazard: {closest_hazard[0]} at {closest_hazard[1]}meters, {closest_hazard[3]} degrees to the left"
                )
                return (
                    closest_hazard[0],
                    f"{closest_hazard[1]:.1f}",
                    closest_hazard[2],
                    "left",
                    f"{closest_hazard[3]:.1f}",
                )

            else:
                print(
                    f"Closest hazard: {closest_hazard[0]} at {closest_hazard[1]}meters, {closest_hazard[3]} degrees to the right"
                )
                return (
                    closest_hazard[0],
                    f"{closest_hazard[1]:.1f}",
                    closest_hazard[2],
                    "right",
                    f"{closest_hazard[3]:.1f}",
                )
        else:
            # maybe return general info if there's no hazard
            return None

    # break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord("q"):
        return None


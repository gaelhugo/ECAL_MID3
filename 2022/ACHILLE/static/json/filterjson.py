import json

with open("fly.json") as jsonFile:
    poses = json.load(jsonFile)

print(len(poses["poses"]))

final_poses = []
for pose in poses["poses"]:
    # pose = poses[p]
    # print(pose)
    final_pos = {}
    final_pos["timestamp"] = pose["timestamp"]
    new_keypoints = []
    for k in pose["pose"]["keypoints"]:
        new_keypoints.append({"position":k["position"]})
    final_pos["pose"] = {"keypoints":new_keypoints}
    final_poses.append(final_pos)


with open('filtered_fly.json', 'w') as json_file:
  json.dump(final_poses, json_file)
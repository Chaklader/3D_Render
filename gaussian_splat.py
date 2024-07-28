# import numpy as np
# import struct
# import scipy.stats as stats
# import matplotlib.pyplot as plt
# import os
#
#
# def load_points3d_bin(file_path):
#     print('Loading points...\n')
#     points = {}
#     with open(file_path, 'rb') as f:
#         while True:
#             data = f.read(3 * 4 + 3 * 1)  # 3 floats (4 bytes each) + 3 uint8 (1 byte each)
#             if len(data) < 15:  # Ensure we have the full set of bytes
#                 break
#             x, y, z = struct.unpack('fff', data[:12])
#             r, g, b = struct.unpack('BBB', data[12:15])
#             point_id = len(points) + 1  # Assign a unique point ID
#             points[point_id] = (np.array([x, y, z]), np.array([r, g, b]))
#     return points
#
#
# def generate_gaussian_splat(point, sigma=0.1):
#     print('Generating Gaussian Splat ....\n')
#     mu = point[0]
#     cov = np.eye(3) * sigma  # Create a 2D covariance matrix
#     rv = stats.multivariate_normal(mean=mu, cov=cov)
#     return rv
#
#
# def save_splats_to_file(points3d, file_path, sigma=0.1):
#     print('Saving splats to file...\n')
#     file_path = os.path.expanduser(file_path)  # Expand the user path
#     with open(file_path, 'w') as f:
#         for point_id, (xyz, rgb) in points3d.items():
#             rv = generate_gaussian_splat((xyz, rgb), sigma)
#             mu = xyz
#             color = rgb / 255.0  # Normalize the color
#             f.write(f"{mu[0]} {mu[1]} {mu[2]} {color[0]} {color[1]} {color[2]} {sigma}\n")
#
#
# # provide the location where you would like to generate the Gaussian Splat
# generated_splat_location = '~/Desktop/gaussian_splat.splat'
#
# print('Loading ...\n')
# points3d = load_points3d_bin('sparse/points3D.bin')
# save_splats_to_file(points3d, generated_splat_location)


import numpy as np
import struct
import scipy.stats as stats
import matplotlib.pyplot as plt
import os
from scipy.spatial.transform import Rotation as R


def quaternion_to_rotation_matrix(q):
    print('Quaternion to rotation matrix....\n')
    q = np.array(q, dtype=np.float64, copy=True)
    n = np.dot(q, q)
    if n < 1e-8:
        return np.identity(3)
    q *= np.sqrt(2.0 / n)
    q = np.outer(q, q)
    return np.array([
        [1.0 - q[2, 2] - q[3, 3], q[1, 2] - q[3, 0], q[1, 3] + q[2, 0]],
        [q[1, 2] + q[3, 0], 1.0 - q[1, 1] - q[3, 3], q[2, 3] - q[1, 0]],
        [q[1, 3] - q[2, 0], q[2, 3] + q[1, 0], 1.0 - q[1, 1] - q[2, 2]]
    ])


# def read_images_bin(path):
#     with open(path, 'rb') as f:
#         num_images = struct.unpack('Q', f.read(8))[0]
#         images = {}
#         for _ in range(num_images):
#             image_id = struct.unpack('I', f.read(4))[0]
#             quaternion = struct.unpack('4d', f.read(32))
#             translation = struct.unpack('3d', f.read(24))
#             camera_id = struct.unpack('I', f.read(4))[0]
#             image_name_length = struct.unpack('Q', f.read(8))[0]
#             image_name = f.read(image_name_length).decode('utf-8')
#             num_points2D = struct.unpack('Q', f.read(8))[0]
#             points2D = [struct.unpack('2d', f.read(16)) for _ in range(num_points2D)]
#             images[image_id] = {
#                 'quaternion': quaternion,
#                 'translation': translation,
#                 'camera_id': camera_id,
#                 'image_name': image_name,
#                 'points2D': points2D
#             }
#     return images


# def compute_average_up_direction(images):
#     up_vectors = []
#     for image in images.values():
#         R = quaternion_to_rotation_matrix(image['quaternion'])
#         up_vector = R[:, 1]  # Assuming Y-axis is the up direction in the camera coordinate system
#         up_vectors.append(up_vector)
#     up_vectors = np.array(up_vectors)
#     average_up = np.mean(up_vectors, axis=0)
#     average_up /= np.linalg.norm(average_up)  # Normalize the vector
#     return average_up


def load_points3d_bin(file_path):
    print('Loading points...\n')
    points = {}
    with open(file_path, 'rb') as f:
        while True:
            data = f.read(3 * 4 + 3 * 1)  # 3 floats (4 bytes each) + 3 uint8 (1 byte each)
            if len(data) < 15:  # Ensure we have the full set of bytes
                break
            x, y, z = struct.unpack('fff', data[:12])
            r, g, b = struct.unpack('BBB', data[12:15])
            point_id = len(points) + 1  # Assign a unique point ID
            points[point_id] = (np.array([x, y, z]), np.array([r, g, b]))
    return points


def generate_gaussian_splat(point, sigma=0.1):
    print('Generating Gaussian Splat ....\n')
    mu = point[0]
    cov = np.eye(3) * sigma  # Create a 3D covariance matrix
    rv = stats.multivariate_normal(mean=mu, cov=cov)
    return rv


def align_gaussian_model(gaussian_model, up_direction):
    print('Aligning Gaussian model...\n')
    # Compute the rotation needed to align up_direction with the Y-axis
    target_up = np.array([0, 1, 0])
    rotation, _ = R.align_vectors([target_up], [up_direction])
    rotation_matrix = rotation.as_matrix()

    # Apply the rotation to each Gaussian in the model
    aligned_model = {}
    for point_id, (mean, color) in gaussian_model.items():
        # Rotate the mean
        aligned_mean = rotation_matrix @ mean

        aligned_model[point_id] = (aligned_mean, color)

    return aligned_model


def save_splats_to_file(points3d, file_path, sigma=0.1):
    print('Saving splats to file...\n')
    file_path = os.path.expanduser(file_path)  # Expand the user path
    with open(file_path, 'w') as f:
        for point_id, (xyz, rgb) in points3d.items():
            rv = generate_gaussian_splat((xyz, rgb), sigma)
            mu = xyz
            color = rgb / 255.0  # Normalize the color
            f.write(f"{mu[0]} {mu[1]} {mu[2]} {color[0]} {color[1]} {color[2]} {sigma}\n")


# def read_images_bin(path):
#     up_vectors = []
#     with open(path, 'rb') as f:
#         num_images = struct.unpack('Q', f.read(8))[0]
#         for _ in range(num_images):
#             f.read(4)  # Skip image_id
#             quaternion = struct.unpack('4d', f.read(32))
#             f.read(24)  # Skip translation
#             f.read(4)  # Skip camera_id
#             image_name_length = struct.unpack('Q', f.read(8))[0]
#             f.read(image_name_length)  # Skip image_name
#             num_points2D = struct.unpack('Q', f.read(8))[0]
#             f.read(16 * num_points2D)  # Skip points2D
#
#             R = quaternion_to_rotation_matrix(quaternion)
#             up_vector = R[:, 1]  # Assuming Y-axis is the up direction
#             up_vectors.append(up_vector)
#
#     return np.array(up_vectors)


def compute_average_up_direction(up_vectors):
    print('Computing average up direction...\n')
    average_up = np.mean(up_vectors, axis=0)
    average_up /= np.linalg.norm(average_up)  # Normalize the vector
    return average_up


def read_images_bin(path, max_images=None):
    print('Reading images...\n')
    up_vectors = []
    with open(path, 'rb') as f:
        try:
            num_images = struct.unpack('Q', f.read(8))[0]
            if max_images is not None:
                num_images = min(num_images, max_images)

            for _ in range(num_images):
                try:
                    f.read(4)  # Skip image_id
                    quaternion = struct.unpack('4d', f.read(32))
                    f.read(24)  # Skip translation
                    f.read(4)  # Skip camera_id
                    image_name_length = struct.unpack('Q', f.read(8))[0]

                    # Skip image name in chunks
                    chunk_size = 1024 * 1024  # 1MB chunks
                    remaining = image_name_length
                    while remaining > 0:
                        to_read = min(remaining, chunk_size)
                        f.read(to_read)
                        remaining -= to_read

                    num_points2D = struct.unpack('Q', f.read(8))[0]
                    f.read(16 * num_points2D)  # Skip points2D

                    R = quaternion_to_rotation_matrix(quaternion)
                    up_vector = R[:, 1]  # Assuming Y-axis is the up direction
                    up_vectors.append(up_vector)
                except struct.error:
                    print(f"Warning: Unexpected end of file after {len(up_vectors)} images.")
                    break
        except struct.error:
            print("Error: File format is incorrect or file is corrupted.")
            return np.array([])

    return np.array(up_vectors)


# In the main execution:
# if __name__ == "__main__":
#     # ... (previous code remains the same)
#
#     # Load COLMAP data and compute average up direction
#     max_images = 1000  # Adjust this value based on your available memory
#     up_vectors = read_images_bin(images_bin_path, max_images)
#
#     if len(up_vectors) == 0:
#         print("Error: Could not read any image data. Exiting.")
#         exit(1)
#
#     average_up_direction = compute_average_up_direction(up_vectors)
#     print(f"Average Up Direction: {average_up_direction}")
#
#     # ... (rest of the code remains the same)

# Main execution
if __name__ == "__main__":
    print('Loading...\n')
    # Paths to your COLMAP output files
    images_bin_path = 'sparse/images.bin'
    points3d_bin_path = 'sparse//points3D.bin'

    # Load COLMAP data and compute average up direction
    max_images = 1000  # Adjust this value based on your available memory
    up_vectors = read_images_bin(images_bin_path, max_images)

    if len(up_vectors) == 0:
        print("Error: Could not read any image data. Exiting.")
        exit(1)

    average_up_direction = compute_average_up_direction(up_vectors)
    print(f"Average Up Direction: {average_up_direction}")

    # Load 3D points
    points3d = load_points3d_bin(points3d_bin_path)

    # Align the Gaussian model
    aligned_points3d = align_gaussian_model(points3d, average_up_direction)

    # Generate and save the aligned Gaussian Splat
    generated_splat_location = '~/Desktop/aligned_gaussian_splat.splat'
    save_splats_to_file(aligned_points3d, generated_splat_location)

    print(f"Aligned Gaussian Splat saved to: {generated_splat_location}")

# Main execution
# if __name__ == "__main__":
#     # Paths to your COLMAP output files
#     images_bin_path = 'sparse/images.bin'
#     points3d_bin_path = 'sparse//points3D.bin'
#
#     # Load COLMAP data
#     images = read_images_bin(images_bin_path)
#     points3d = load_points3d_bin(points3d_bin_path)
#
#     # Compute average up direction
#     average_up_direction = compute_average_up_direction(images)
#     print(f"Average Up Direction: {average_up_direction}")
#
#     # Align the Gaussian model
#     aligned_points3d = align_gaussian_model(points3d, average_up_direction)
#
#     # Generate and save the aligned Gaussian Splat
#     generated_splat_location = '~/Desktop/aligned_gaussian_splat.splat'
#     save_splats_to_file(aligned_points3d, generated_splat_location)
#
#     print(f"Aligned Gaussian Splat saved to: {generated_splat_location}")

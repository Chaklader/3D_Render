import numpy as np
import struct
import scipy.stats as stats
import matplotlib.pyplot as plt
import os

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

def save_splats_to_file(points3d, file_path, sigma=0.1):
    print('Saving splats to file...\n')
    file_path = os.path.expanduser(file_path)  # Expand the user path
    with open(file_path, 'w') as f:
        for point_id, (xyz, rgb) in points3d.items():
            rv = generate_gaussian_splat((xyz, rgb), sigma)
            mu = xyz
            color = rgb / 255.0  # Normalize the color
            f.write(f"{mu[0]} {mu[1]} {mu[2]} {color[0]} {color[1]} {color[2]} {sigma}\n")

# Provide the location where you would like to generate the Gaussian Splat
generated_splat_location = '~/Desktop/gaussian_splat.splat'

print('Loading ...\n')
points3d = load_points3d_bin('sparse/points3D.bin')

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

for point_id, (xyz, rgb) in list(points3d.items())[:2]:  # Adjust the range as needed
    rv = generate_gaussian_splat((xyz, rgb))
    mu = xyz  # Define mu as the xyz coordinates
    x, y, z = np.mgrid[mu[0] - 1:mu[0] + 1:0.1, mu[1] - 1:mu[1] + 1:0.1, mu[2] - 1:mu[2] + 1:0.1]
    pos = np.empty(x.shape + (3,))
    pos[:, :, :, 0] = x
    pos[:, :, :, 1] = y
    pos[:, :, :, 2] = z
    pdf = rv.pdf(pos)
    ax.scatter(x, y, z, c=pdf, alpha=0.5)  # Adjust alpha for better visualization

plt.show()

# Uncomment to save the splats to a file
# save_splats_to_file(points3d, generated_splat_location)
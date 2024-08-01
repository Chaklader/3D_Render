

```textmate
python convert.py --source_path /path/to/your/colmap/sparse/folder --images_path /path/to/your/images/folder --output_path /path/to/output

python train.py --source_path /path/to/converted/data --model_path /path/to/save/model --iterations 30000

python render.py --model_path /path/to/saved/model --images_path /path/to/output/images
```


```textmate
colmap feature_extractor --database_path database.db --image_path images
colmap exhaustive_matcher --database_path database.db
colmap mapper --database_path database.db --image_path images --output_path sparse
```


# Average UP with COLMAP

```textmate
colmap feature_extractor --database_path database.db --image_path images --ImageReader.camera_model PINHOLE --ImageReader.single_camera 1
colmap exhaustive_matcher --database_path database.db
colmap mapper --database_path database.db --image_path images --output_path sparse --Mapper.ba_global_use_trivial_poses 0 --Mapper.ba_refine_focal_length 1 --Mapper.ba_refine_extra_params 1 --Mapper.ba_global_images_ratio 1.0 --Mapper.init_min_tri_angle 4 --Mapper.ba_global_max_refinements 10 --Mapper.ba_local_max_refinements 10

colmap bundle_adjuster --input_path sparse --output_path sparse_refined --BundleAdjustment.refine_focal_length 1 --BundleAdjustment.refine_principal_point 1 --BundleAdjustment.refine_extra_params 1
```


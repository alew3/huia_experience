# Huia Experience

# 01 Capturing Data

I created a simple Javascript page to capture images from the webcam. Instead of capturing the raw video feed, we are processing it with [TensorflowJS Posenet model](https://github.com/tensorflow/tfjs-models/tree/master/posenet) to do feature extraction and use this data to get the skeleton keypoints. We will be saving both keypoints and a generated image (PNG) to use for training for later use for training and compare if using images or data will generalize better our model.


## How to install and run

You will need [NodeJS](https://nodejs.org/) >= 8.9 and [Yarn](https://yarnpkg.com/) >=1.15 installed (it might work on older versions but I didn't test it). 


Go to the directory **/01_capture** and run the following commands.

```
$ cd 01_capture # change to this folder
$ yarn install  # install modules 
$ yarn watch    # start node server
```


## Capturing Data for Training

We are saving our captured images into the folder **/training_data** that will later be used to train our Neural Network model for pose detection.

We are using the following file naming convention:

**posename_number**

For example, we could have the following files for the poses **jump** and **run**:
```
\training_data
    \images
        \jump_01.png
        \jump_02.png
        ...
        \run_01.png
        \run_02.png
        ...
    \keypoints
        \jump_01.json
        \jump_02.json
        ...
        \jump_01.json
        \jump_02.json
        ...
        ... etc
```


## How to use

*Screen shot here*

### Timer mode
*Description here*


### Manual mode
*Description here*

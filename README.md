# K-Lab CLI
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/kjhx/klab-cli/CI)
![npm](https://img.shields.io/npm/v/klab-cli)

The photo processing assistant.

## Installation

First, install the package from NPM:
```shell
npm install -g klab-cli@latest
```

Once that's done, you can run the tool with this command:
```shell
klab
```

## Manual

### `klab process [options]`
Organizes photos within the current directory by date. It will create subdirectories for each date your photos were taken and organize the RAW and JPG shots into respective subdirectories.

It supports the following options:
* `-r, --rawfile <type>`: specify the RAW file extension. Defaults to ARW.
* `-e, --exclude`:  exclude folders from iCloud Drive (macOS only) by appending `.nosync` to top-level folder names.

### `klab prune [options] [directory]`
Deletes RAW files that do not have a matching JPG. Expects photos to be stored in `RAW` and `JPG` directories. Defaults to current directory, but can be passed any directory as an argument.

It supports the following option:
* `-r, --rawfile <type>`: specify the RAW file extension. Defaults to ARW.

### `klab report`
Opens the New Issue page of this repository in the default browser.

## Usage

K-Lab is a tool built around how I process photos. In-camera, I'll choose to shoot RAW+JPG. Before I can post-process, I'll offload all the images into a single directory, like this:
```
.
├── KJH02989.ARW
├── KJH02989.JPG
├── KJH02990.ARW
└── KJH02990.JPG
```

I can then use `klab process` to organize my images by date and filetype, like so:
```
.
├── 2020-05-21
│   ├── JPG
│   │   ├── KJH02989.JPG
│   │   └── KJH02994.JPG
│   └── RAW
│       ├── KJH02989.ARW
│       └── KJH02994.ARW
└── 2020-05-22
    ├── JPG
    │   ├── KJH03128.JPG
    │   └── KJH03136.JPG
    └── RAW
        ├── KJH03128.ARW
        └── KJH03136.ARW
```

Now, I can quickly flip through all of my JPGs from each day of shooting to decide which ones I want to keep – I'll delete the JPGs that I don't want. Then, I use `klab prune ./2020-05-21` to automatically delete RAW files that don't have a matching JPG for that day. This leaves me with only the RAW files that I want to edit.

## Etymology

"K-Lab" comes from the Kodak program (and processing machines) of the same name. The K-Lab program was created by Kodak in the late 90's to make processing Kodachrome film more accessible.
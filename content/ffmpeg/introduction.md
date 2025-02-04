# FFMPEG

FFMPEG = “Fast-Forward-Moving-Picture-Expert Group”

## TERMS

**ENCODE**: The process to compress a file so to enable a faster transmission of data.

**DECODE**: The function of a program or a device that translates encoded data into its original format.

**CODEC**: A codec is the combination of two words en**CO**der and **DEC**oder. An encoder compress a source file with a particular algorithm: then a decoder can decompress and reproduce the resulting file.

- Common examples of video codecs are: MPEG-1, MPEG-2, H.264 (aka AVC), H.265 (aka HEVC), H.266 (aka VVC), VP8, VP9, AV1, or audio codecs such as Mp3, AAC, Opus, Ogg Vorbis, HE-AAC, Dolby Digital, FLAC, ALAC.

**BITRATE**: Bitrate or data rate is the amount of data per second in the encoded video file, usually expressed in kilobits per second (kbps) or megabits per second (Mbps). The bitrate measurement is also applied to audio files.

- An Mp3 file, for example, can reach a maximum bitrate of 320 kilobit per second, while a standard CD (non- compressed) audio track can have up to 1.411 kilobit per second.
- A typical compressed h264 video in Full-HD has a bitrate in the range of 3.000 - 6.000 kbps, while a 4k video can reach a bitrate value up to 51.000 kbps.
- A non-compressed video format, such as the Apple ProRes format in 4K resolution, can reach a bitrate of 253.900 kbps and higher.

**CONTAINER**: Like a box that contains important objects, containers exist to allow multiple data streams, such as video, audio, subtitles and other data, to be embedded into a single file.

- Amongst popular containers there are: MP4 (.mp4), MKV (.mkv), WEBM (.webm), MOV (.mov), MXF (.mxf ), ASF (.asf ), MPEG Transport Stream (.ts), CAF (Core Audio Format, .caf ), WEBP (.webp).

**MUX**: This is the process of taking encoded data in the form of 'packets' and write it into files, in a specific container format.

**DEMUX**: The process of reading a media file and split it into chunks of data.

**TRANSMUXING**: Also referred to as "repackaging" or "packetizing", is a process in which audio and video files are repackaged into different delivery formats without changing the original file content.

**TRANSCODING**: The process of converting a media file or object from one format to another.

**RESOLUTION**: Resolution defines the number of pixels (dots) that make up the picture on your screen.

- Each of these resolutions also has a number and a name associated with it. For example: 480 is associated to SD (Standard Definition). 720 and 1080 are associated to HD (High-Definition), 2160 is associated to UHD (Ultra-High- Definition) and finally 4320 is associated to 8K UHD.

**ASPECT RATIO**: This is the ratio (relation) of width to height of the TV screen. Certain aspect ratios are designed to handle certain resolutions without any stretching or distortion of the picture and without any blank space around the picture.

- Common aspect ratios are the "4:3 aspect ratio" meaning that for every 4 inches of width in an image, you will have 3 inches of height. Another popular aspect ratio is 16:9, meaning thath for every 16 inches of width in an image, you will have 9 inches of height.

**INTERLACED FORMAT**: It's a technique invented in the 1920s to display a full picture by dividing it into 2 different set of lines: the even and the odd lines. The even lines are called "even field", while the odd lines are called the "odd field".

- The even lines are displayed on the screen, then the odd lines are displayed on the screen, each one every 1/60th of a second: both of these, even and odd fields, make up one video frame. This is one of the earliest video compression methods

**PROGRESSIVE**: Progressive format refers to video that displays both the even and odd lines, meaning the entire video frame, at the same time.

**LETTER BOX**: Letterboxing is the practice of transferring film shot in a widescreen aspect ratio to standard-width video formats while preserving the content's original aspect ratio. The resulting videographic image has black bars above and below it. LBX or LTBX are the identifying abbreviations for films and images so formatted.

**VOD/SVOD**: Acronym for Video On Demand / Subscription-based Video On Demand.

**OTT**: Abbreviation for "Over-the-top". A video streaming service offered directly to the public thru an internet connection, rather than thru an antenna, cable or satellite.

**STREAMING**: The process of delivering media thru small chunks of compress data and sent to a requesting device.

**RTMP**: Real-Time-Messaging-Protocol. A proprietary protocol originally developed by Macromedia, today Adobe.

**HLS**: HTTP-Live-Streaming Protocol. Created by Apple for delivering video destined for Apple devices.

**DASH**: Dynamic Adaptive Streaming over HTTP. This protocol can be defined as the open-source HLS.

**M3U8**: A standard text file encoded in UTF-8 format and organized as a playlist of items with their location, to be reproduced in a particular sequence.

**AV1**: Stands for AOMedia Video 1, which is an acronym for Alliance for Open Media Video 1, a codec developed in joint-venture by Amazon, Cisco, Google, Intel, Microsoft, Mozilla, Neflix, ARM, NVidia, Apple and AMD.

**BATCH PROCESSING**: The act of processing a group of catalogued files.

**HDR**: Acronym for High-Dynamic-Range. It is about recreating image realism from camera through postproduction to distribution and display.

**h264**: A standard of video compression defined by the Motion Expert Picture Group (MPEG) and the International Telecommunication Union (ITU). It is also referred to h264/ AVC (Advanced Video Coding).

**x264**: a free software library and application for encoding video streams into the H.264/MPEG-4 AVC compression format.

## Basic FFMPEG Workflow

**Input Source** --(Demux)--> **Chunks of Data** --(Decode)--> **Decoded Data** --(Encode)--> **Encoded Data** --(Mux)--> **Output File**

## Install on MacOS

```bash
brew install homebrew-ffmpeg/ffmpeg/ffmpeg
```

Check version:

```bash
ffmpeg -version
```

## Install FFMPEG 3.x on Ubuntu

```bash
sudo apt update && sudo apt install ffmpeg
```

## Install FFMPEG 4.x on Ubuntu

```bash
sudo apt install snapd && sudo snap install ffmpeg
```

## Basic Syntax Concepts

Convert ".wav" format into ".mp3"

```bash
ffmpeg -i mysong.wav mysong.mp3
```

- The "-i" stands for "input". This input can be a local file in your computer or a file from a remote URL.

Convert ".wav" format into ".mp3" with complex options

```bash
ffmpeg -i mysong.wav -af loudnorm -c:a mp3 -b:a 256k -ar 48000 mysong.mp3
```

- `-af loudnorm`: will apply an "Audio Filter Loudnorm" which will perform a standard audio loudness normalization

- `-c:a mp3`: stands for "codec audio Mp3". This option will specify that we want to export an Mp3 file.

- `-b:a 256k`: stands for "bitrate of the audio" and will produce an audio file with "Bitrate Audio at 256 Kbit/s"

- `-ar 48000`: stands for "Audio Rate". This option will specify furthemore that we want to create an output file with a specific audio sampling rate (in this example 48000 KHz).

Convert ".mov" format into ".mp4"

```bash
ffmpeg -i master.mov master.mp4
```

Convert ".mov" format into ".mp4" with complex options

```bash
ffmpeg -i https://www.dropbox.com/master.mov -t 00:02:30 -c:v h264 -b:v 3M -c:a aac -b:a 128k -ar 44100 -ac 2 master.mp4
```

- `-i`: stands for "input"
- `-t`: stands for "process only for a specified duration" -c:v: stands for "codec video"
- `-b:v`: stands for "video bitrate" which is the amount of desired video data per second, expressed in Megabit -c:a: stands for "audio codec"
- `-b:a`: stands for "audio bitrate", which is the amount of
  the desired audio data per second, expressed in kilobit
- `-ar`: stands for "Audio Rate", which is also known as "sampling rate".
- `-ac 2`: stands for "2 Audio Channels (Left+Right)"

A `sample` is a measurement — a snapshot, if you will — at one specific time in that audio track, described in the binary language of 1s and 0s.

Repeat that measurement tens of thousands of times each second; how often that snapshot is taken represents the sample rate or sampling frequency, measured in kiloHertz, a unit meaning 1,000 times per second.

Audio CDs, for example, have a sample rate of 44.1kHz, which means that the analog signal is sampled 44,100 times per second.

## Keyframes: Basic Concepts

Any video content is made up of a series of frames. Usually denoted as FPS (frames per second), each frame is a still image that when played in sequence creates a moving picture.

- A content at 30 FPS means that there are 30 “still images” that will play for every second of video

A frame can be compressed in many different ways, depending on the algorithm used. These different algorithms are mostly referred as "picture types" or "frame types".

Some of the most advanced codecs uses 3 frame types or picture types, namely:

- The **I-frame**: a frame that stores the whole picture

  - Short for intraframe, a video compression method used by the MPEG standard.
  - In a motion sequence, individual frames of pictures are grouped together, to form the above mentioned GOP, and played back so that the viewer registers the sense of motion.
  - An I-frame, also called keyframe, is a single frame of digital content that the compressor examines independently of the frames that precede and follow it and stores all of the data needed to display that frame.
  - Typically, the I-frames are interspersed with P-frames and B-frames in a compressed video.
  - The more I-frames that are contained the better quality the video will be. However, I-frames contains the most amount of bits and therefore take up more space on the storage medium

- The **P-frame**: a frame that stores only the changes between the current picture and previous ones

  - Short for predictive frame, or predicted frame. It follows I-frames and contain only the data that have changed from the preceding I-frame, such as color or content changes. Because of this, P-frames depend on the I-frames to fill in most of the data.

- The **B-frame**: a frame that stores differences with previous or future pictures

  - Short for bi-directional frame, or bi-directional predictive frame. As the name suggests, B-frames rely on the frames preceding and following them. B-frames contain only the data that have changed from the preceding frame or are different from the data in the very next frame.

These 3 frame types forms a Group Of Pictures (or GOP) that specifies the order in which I-frames, B- frames and P-frames are arranged

**How Do You Set A Keyframe Interval and Why?**

Assuming that you need to stream a file at 25FPS, using the h264 codec, a good idea will be to specify a keyframe interval of 2 seconds, using the following formula:

```basg
ffmpeg -i YOUR_INPUT -c:v h264 -key_int_min 25 -g 50 -sc_threshold 0 OUTPUT.mp4
```

- `-c:v h264`: is the h264 codec selector
- `-key_int_min`: specifies the minimum interval to set a keyrame. In this example will set a minimum keyframe interval every 25 frames.
- `-g 50`: this option stands for "Group of Pictures" and will instruct FFMPEG to sets the maximum keyframe interval every 50 frames, or 2 seconds, assuming that your input runs at 25 FPS.
- `-sc_threshold 0`: This "SC" stands for Scene Change. FFmpeg defaults to a keyframe interval of 250 frames and inserts keyframes at scene changes, meaning when a picture's content change. This option will make sure not to add any new keyframe at scene changes.

The reason why a short keyframe interval is very important is because we need to provide the end user with a fast experience during playback or seeking (fast forward or rewind) a video, especially for the Adaptive Bitrate case scenario, where the end user automatically receives the highest or the lowest quality, based on his own available bandwidth. Also, a player can not start playback on a p- frame or b-frame.

## Metadata and FFPROBE

FFPROBE gathers information from multimedia streams and prints them in human- and machine-readable fashion.

When it comes to video, metadata, which is a set of data that describes and give information about other data, is used to describe information related to the video asset

The metadata can be displayed as a visible text to the end user, such as tags and descriptions, but also invisible to them, such as keywords or Digital Rights Management (DRM) information used to secure an asset against piracy concerns

Metadata can also contain important informations on the audio track of a video, including the authors, composers, performers, the music genre, all the copyright informations, the credits, etc.

FFMPEG comes with 3 different programs. The main program is FFMPEG itself, then there is FFPLAY, a simple player mainly used for testing purposes and then FFPROBE, which gathers informations from your input.

- It may be employed both as a standalone application or in combination with a textual filter, which may perform more sophisticated processing, e.g. statistical processing or plotting, meaning illustrating by the use of a graph.

A basic formula for FFPROBE is:

```bash
ffprobe YOUR_INPUT.mp4
```

- This will output lots of informations (metadata), including the lenght of a file, the type of the codec used for audio and video, the size, the display size, the number of frames-per-second, etc.

You may just want to extract only the time of a stream. This function is called "Stream Duration" and the formula is:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 -sexagesimal YOUR_INPUT.mp4
```

- `-v error`: select the "error" log, which will display every errors, including ones which can be recovered from
- `-select_streams v:0`: this will select the very first stream of the video input (FFMPEG and FFPROBE starts to count from 0)
- `-show_entries stream=duration`: this will instruct FFPROBE to display the duration of the stream
- `-of default=noprint_wrappers=1:nokey=1`: this means "print format" (-of ). The other options are meant to instruct to display only the requested information (stream duration) without any other additional information.
- `-sexagesimal`: this will instruct FFPROBE to display the restuls in sexagesimal format (HH:MM:SS:ms)

The above command will output something like this: `0:06:52.100000`

The duration will be expressed in HH:MM:SS:ms, or sexagesimal (also known as base 60 or sexagenary), which is a numeral system with sixty as its base.

## Extracting Metadata with FFMPEG

To extract the existing metadata from an audio file you can use FFMPEG by typing this command:

```bash
ffmpeg -i YOUR_INPUT -f ffmetadata out.txt
```

- `-f`: Force input or output file format.
- `ffmetadata`: "FFMPEG's Dump of Metadata".

## Extracting Specific Streams

- `-map` option is used to choose which streams from the input(s) should be included in the output(s). In other words, if you need to extract only a specific stream of your file, this is the right option for you.

### How FFMPEG works by default

If you do not use the -map option then the default stream selection behavior will automatically choose streams

Please note:

- Default stream selection will not automatically choose all of the streams;
- Only one stream per type will be selected. For example, if the input has 3 video streams it will only choose 1;
- The default stream selection will choose streams based upon specific criteria.

Let's take an example file called "home.mov" of a video containing 3 audio tracks: 1) english, 2) italian and 3) spanish, along with their respective subtitles track.

```bash
ffmpeg -i home.mov -map 0 -c:a aac -c:v h265 YOUR_OUTPUT.mkv
```

- `-map 0`: with this option you will select all streams

In the above example command you will select all the audio and video streams from the "home.mov" file and convert them into an h265 file, with audio in AAC format, in a default configuration, into an MKV container.

`-map 0:v -map 0:2`: with this option you will extract the first video stream and the second audio stream. In our "home.mov" example will be the "italian" audio track. Please note that FFMPEG starts to count the streams from 0, not from number 1.

## Extracting Audio Only from a Video

Textract only the audio stream from a video track, you can use the following formula:

```bash
ffmpeg -i YOUR_INPUT.mp4 -vn -c:a copy YOUR_OUTPUT.aac
```

- `-vn`: no video

The above command will copy the audio track without converting it, assuming that your input contains an AAC (Advanced Audio Codec) audio track.

You can choose to convert the audio input, selecting the desired codec and parameters, for example:

```bash
ffmpeg -i YOUR_VIDEO.mov -vn -c:a mp3 -b:a 128k -ar 44100 -ac 2 YOUR_AUDIO.mp3
```

This will extract the audio track from input "YOUR_VIDEO.mov" and will convert it to an Mp3 file, at 128 Kbps, 44.100 kHz, in Stereo.

## Extracting Video Only without Audio

if you need to extract video from a file, without any audio, you can use the following formula

```bash
ffmpeg -i YOUR_VIDEO -an -c:v copy OUTPUT
```

- `-an`: no audio

The above example will produce an exact copy of the video, without re-encoding it (`-c:v copy`).

If you need to convert your input's video without the audio, then you can use a formula like this:

```bash
ffmpeg -i YOUR_VIDEO.mov -an YOUR_VIDEO_WITHOUT_AUDIO.h265
```

The above command will trigger some of the best options in order to convert the example ".mov" input into a standard h265 file, without the original audio.

## Cutting Videos with FFMPEG

With the function `-ss` (before `-i`) you can set a desired "In" marker and with the function `-t` you can set an "Out" marker for the specified duration.

Please note that if you want to cut a video without re-encoding it, using the `-c copy` option, there won't be general rule on how correctly set both time points for `-ss` and `-t` options, because those depend on the keyframe interval used when the input was encoded.

To give some orientation, the x264 encoder by default uses a GOP size of 250, which means 1 keyframe each 10 seconds if the input frame rate is 25 fps.

### Extracting 20 seconds without re-encoding

```bash
ffmpeg -ss 00:01:30.000 -i YOUR_VIDEO.mp4 -t 00:00:20.000 -c copy YOUR_EXTRACTED_VIDEO.mp4
```

- `-ss 00:01:30.000`: If putted before the -i input, this seeks in the input file at the specified time value. Time can be expressed in hours, minutes, seconds and milliseconds. hh:mm:ss.ms format.

- `-t 00:00:20.000`: the duration of the desired portion, that you can specify in sexasegimal format (hh:mm:ss.ms). In this example a duration of 20 seconds.

- `-c copy`: this option will copy the audio and video streams, without re-encoding them

### Extracting 20 seconds with encoding

```bash
ffmpeg -ss 00:01:30.000 -i YOUR_VIDEO.mp4 -t 00:00:20.000 YOUR_EXTRACTED_VIDEO.mp4
```

## Producing h264/AVC videos

When working with h264 you might want to decide first whether you want to work with a Constant Rate Factor, **CRF**, which keeps the best quality and care less about the file size, or using a **Two-Pass Encoding**, if you are targeting a specific output file size, and if the output quality from frame to frame is of less importance.

### Using a Constant Rate Factor

The range of the CRF scale is 0–51, where 0 is lossless, 23 is the default, and 51 is worst quality possible.

A lower value generally leads to higher quality, and a subjectively sane range is 17– 28. Consider 17 or 18 to be visually lossless or nearly so; it should look the same or nearly the same as the input but it isn't technically lossless.

### Presets

A preset is a collection of options that will provide a certain encoding speed to compression ratio.

A slower preset will provide better compression (compression is quality per filesize).

This means that, for example, if you target a certain file size or constant bit rate, you will achieve better quality with a slower preset. Similarly, for constant quality encoding, you will simply save bitrate by choosing a slower preset.

### The Tune Option

FFMPEG gives you also a `-tune` option to change settings based upon the specifics of your input.

```bash
ffmpeg -i your_video.mov -c:v h264 -crf 23 -tune film your_output.mp4
```

Tune options are:

- film – use for high quality movie content;
- animation – good for cartoons;
- grain – preserves the grain structure in old, grainy film material;
- stillimage – good for slideshow-like content;
- fastdecode – allows faster decoding by disabling certain filters;
- zerolatency – good for fast encoding and low-latency streaming;
- psnr – only used for codec development;
- ssim – only used for codec development;

### The 2-Pass Encoding

If you are targeting a specific output file size, and if output quality from frame to frame is of less importance, then you may want to use a 2-Pass encoding method.

For two-pass, you need to run FFMPEG twice, with almost the same settings, except for: In pass 1 and 2, use the `-pass 1` and `-pass 2` options, respectively.

In pass 1, output to a null file descriptor, not an actual file. This will generate a logfile that FFMPEG needs for the second pass.

In pass 1 you need to specify an output format (with `-f`) that matches the output format you will use in pass 2.

```bash
ffmpeg -y -i [YOUR_INPUT] -c:v h264 -b:v 2600k -pass 1 -an -f mp4 /dev/null && \
ffmpeg -i [YOUR_INPUT] -c:v h264 -b:v 2600k -pass 2 -c:a aac -b:a 128k output.mp4
```

### Faststart

As mentioned in the FFMPEG documentation, you can add `-movflags +faststart` as an output option if your videos are going to be viewed in a browser.

This will move some informations at the beginning of your file and allow the video to begin playing, before it is completely downloaded by the viewer.

It is also recommended by YouTube.

```bash
ffmpeg -i input -c:v h264 -crf 23 -maxrate 1M -bufsize 2M -movflags +faststart output.mp4
```

## Streaming on Social Media with RTMP

The RTMP stands for "Real-time Messaging-Protocol" and RTMPS stands for the same, but over a TLS, Transport Layer Security, or a SSL connection

### Streaming for YouTube Live

For HD 1080p streams, in example, you will need to adhere at the following requirements:

- Resolution: 1920x1080
- Video Bitrate Range: 3.000-6.000 Kbps
- Video Codec: H.264, Level 4.1 for up to 1080p 30
- FPS or Level 4.2 for 60 FPS
- Keyframe Frequency: 2 seconds
- Audio Codec: AAC or Mp3
- Bitrate Encoding: CBR (Constant Bit Rate)

With all of that in mind, assuming to have a Full-HD 1080p 25 FPS video to be broadcasted Live on YouTube, an example command will be:

```bash
ffmpeg -re -i INPUT.mp4 -c:v libx264 -profile:v high -level:v 4.1 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -keyint_min 50 -sc_threshold 0 -c:a aac -b:a 128k -ac 2 -ar 44100 -f flv "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAMING_KEY"
```

- `-re`: instruct FFMPEG to read the source file at its native frame rate
- `-c:v libx264 -profile:v high -level:v 4.1 -preset veryfast`: This will instruct FFMPEG to use the libx264 for producing an optimized h264 file, with the "High Profile" setting, which is the primary profile for broadcast and disc storage applications, particularly for high-definition television applications, adopted also for HD DVD and Blu-ray Disc, and level 4.1 as explained here, and by using the veryfast preset.
- `-b:v 3000k -maxrate 3000k -bufsize 6000k`: this will instruct FFMPEG to produce a file that stays in the 3.000-6000 video bitrate range required by YouTube. More specifically the `-b:v` option specifies the video bitrate (you can either type 3000k or 3M), `-maxrate` stands for the maximum bitrate to stream and the `-bufsize` (buffer size) option will calculate and correct the average bit rate produced.
- `-pix_fmt yuv420p`: This will instruct FFMPEG to use a specific chroma subsampling scheme named 4:2:0 planar. This instruction is specified for compatibility reasons, since your output must be playable across different players and platforms. Chroma subsampling is the practice of encoding images by implementing less resolution for chroma information, than for luma information, taking advantage of the human visual system's lower acuity for color differences than for luminance. "YUV" is a type of video signal that consists of three separate signals: 1 for luminance (brightness) and two for chrominance (colours).
- `-g 50`: In order to abide to the required 2 second keyframe interval, this will set a value of 50 GOP, Group of Pictures. This value of "50" is just an example. To know the exact value for your case, simply multiply your output frame rate \* 2. For example, if your original input runs at 24 FPS, then you will use `-g 48`.
- `-keyint_min value 50`: this will specify the minimum distance between I-frames and must be same as the `-g` value
- `-sc_threshold 0`: This stands for Scene Change Threshold. FFmpeg defaults to a keyframe interval of 250 frames and inserts keyframes at scene changes. This option will make sure to not adding any new keyframe when the content of a picture changes.
- `-c:a aac -b:a 160k -ac 2 -ar 44100`: with this instructions you will make FFMPEG encode the audio using the built-in Advanced Audio Codec (-c:a aac), with a bitrate of 160 Kbps (-b:a 160k), in stereo ("-ac 2" stands for Stereo), with an audio sampling rate of 44.100 kHz (-ar 44100).
- `-f flv rtmp://a.rtmp.youtube.com/live2/ [YOUR_STREAM_KEY]`: this will instruct FFMPEG to output everything into the required FLV format to the YouTube RTMP server.

If your machine is slow and just can't handle the real- time encoding process, such in the case of Full-HD videos or 4K or above, you can always pre-process the file before streaming it.

You have simply to create a file with the same command as above, but with a different destination (a file), such as in this example for a Full-HD 1080p/25fps video:

```bash
ffmpeg -i INPUT.mp4 -c:v libx264 -profile:v high -level:v 4.1 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -keyint_min 50 -sc_threshold 0 -c:a aac -b:a 128k -ac 2 -ar 44100 OUTPUT.mp4
```

The preset can also be adjusted to a slower one, in order to have a better compression.

Then you just need to "stream-copy" the file to the YouTube or to another RTMP destination, such as in this example formula:

```bash
ffmpeg -re -i OUTPUT.mp4 -c copy -f flv "rtmp://a.rtmp.youtube.com/live2/ YOUR_STREAMING_KEY"
```

### Loop pre-processed video

```bash
ffmpeg -re -stream_loop -1 -i OUTPUT.mp4 -c copy -f flv "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAMING_KEY"
```

### Loop a definite number of times (example 4 times)

```bash
ffmpeg -re -stream_loop 4 -i OUTPUT.mp4 -c copy -f flv "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAMING_KEY"
```

## Pre-process Files in Batch

In case of large volumes of videos you might want to automate the pre-process action described previously.

```bash
for i in *.mov; do ffmpeg -i "$i" -c:v libx264 -profile:v high -level:v 4.1 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -r 25 -g 50 -keyint_min 50 -sc_threshold 0 -c:a aac -b:a 128k -ac 2 -ar 44100 "${i%.*}.mp4"; done
```

The above example script will pre-process every .mov file contained in the directory, in line with the YouTube's requirements for streaming a Full-HD 1080p at 25FPS.

If your source inputs have the same extension
(e.g.: .mp4) you can use the following script, that will add the suffix `-converted` to your output file:

```bash
for i in *.mp4; do ffmpeg -i "$i" -c:v libx264 -profile:v high -level:v 4.1 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -r 25 -g 50 -keyint_min 50 -sc_threshold 0 -c:a aac -b:a 128k -ac 2 -ar 44100 "${i%.*} - converted.mp4"; done
```

## Re-stream to multiple destinations

`-tee` can be used to write the same data to several outputs, such as files or streams. It can be used also, for example, to stream a video over a network and save it to disk at the same time.

```bash
ffmpeg -i INPUT -c:v h264 -c:a aac -f tee -map 0:v -map 0:a "output.mkv|[f=mpegts]udp://10.0.1.255:1234/"
```

## Concatenate Video Playlists

The process requires 4 separate steps, so to ensure maximum compatibility with the technical requirements of most of the major streaming platforms.

The 4 steps are:

1. Conform your files to the platform's tech specs;

   - To pre-process the files we'll take as an example the 1080p, 25 FPS requirements of YouTube:

   - Resolution: 1920x1080
   - Video Bitrate Range: 3.000-6.000 Kbps
   - Video Codec: H.264, Level 4.1 for up to 1080p 30 FPS or Level 4.2 for 60 FPS
   - Keyframe Frequency: 2 seconds
   - Audio Codec: AAC or Mp3
   - Bitrate Encoding: CBR (Constant Bit Rate)

   - The command to produce a file with the above mentioned specs will be as follow:

   ```bash
   ffmpeg -i YOUR_INPUT -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -keyint_min 50 -sc_threshold 0 -c:a aac -b:a 128k -ac 2 -ar 44100 OUTPUT.mp4
   ```

2. Segment the files in HLS format with Bento4;

   - Bento4 is a set of tools designed to produce standard HLS and DASH packages. HLS stands for Apple HTTP Live Streaming, while DASH, Dynamic Adaptive Streaming over HTTP, is the open-source alternative.

   - In addition to supporting ISO-MP4, Bento4 includes support for parsing and multiplexing H.264 and H.265 elementary streams, converting ISO-MP4 to MPEG2-TS, packaging HLS and MPEG-DASH, content encryption, decryption, and much more.

   - To segment your file with Bento4 you will use the following formula for every video pre-processed during Step 1:

   ```bash
   mp42hls --output-single-file OUTPUT.mp4
   ```

   - This command will store segment data in a single output file per input file, without producing tens or hundreds of segments.

   - This command will also create 3 distinct files:

   1. The stream.ts file which is the segmented file itself, in MPEG Transport Stream format (.ts);
   2. The stream.m3u8 file, which is the playlist of the segments;
   3. A iframe.m3u8 file, which is not required for this specific purpose, but required for VOD development purposes.

   - To test the stream.m3u8 file on YouTube Live, just type the following command:

   ```bash
   ffmpeg -re -i stream.m3u8 -c copy -f flv "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAMING_KEY"
   ```

3. Create a playlist in M3U8 format;

   - Once you will have conformed and segmented your videos, you will need to create a text file in order to create your desired playlist of videos to be broadcasted live.

   - In order to do so, just open your favourite text editor, or as in this example the Nano text editor and type the following: `nano playlist.txt`

   - Then:

   ```bash
   file 'video1/stream.m3u8'
   file 'video2/stream.m3u8'
   file 'video3/stream.m3u8'
   file 'video4/stream.m3u8'
   file 'video5/stream.m3u8'
   ```

   And so forth, depending on how many videos you will need to concatenate.

4. Stream the M3U8 playlist to the RTMP server;

   Once you have created your playlist in the desired order of reproduction, you will be able to stream it by using the following formula:

   ```bash
   ffmpeg -re -f concat -i playlist.txt -c copy -f flv "rtmp://a.rtmp.youtube.com/live2/YOUR_STREAMING_KEY"
   ```

   Optionally you can loop infinitely your playlist with the instruction `-stream_loop -1` before the `-i playlist.txt` section, or specify a number based on how many loop you want, with the `-stream_loop` [DESIRED NUMBER OF TIMES]

   Please note: usually after 24 hours (or less), the FFMPEG streaming process could be interrupted by a "Broken Pipe" error. This can happen if you stream directly to the RTMP address provided by YouTube by or any other major platform. From my direct experience if you stream your signal to a video server such as Nimble Streamer or Wowza, and then from there you re-stream the signal to the YouTube/FB/Periscope RTMP server, you will be able to fix such "Broken Pipe" error and obtain a non-stop 24/7 streaming signal.

## Scaling with FFMPEG

Resolution = width x height

FFMPEG offers several ways to scale a video. The fastest method is by using the -s option, such in this example:

```bash
ffmpeg -i YOUR_INPUT.mov -s 1280x720 YOUR_OUTPUT.mp4
```

You can specify a width and height in pixel, such as in the above example, or you can use video resolution abbreviations, as described in the official FFMPEG's documentation, such in the following example:

```bash
ffmpeg -i YOUR_INPUT.mov -s 4kdci YOUR_OUTPUT.mov
```

- By specifying -s 4kdci you will instruct FFMPEG to scale your input video at 4096x2160 pixels (4K resolution).

### The Pixel Aspect Ratio (PAR)

PAR is a mathematical ratio that describes how the width of a pixel in a digital image compares to the height of that pixel.

The pixel aspect ratio (PAR) is a value that can be specified in the FFMPEG's output, to instruct the final user's player how to display the pixels, using the combination of `-vf scale` (Video Filter for scaling) and the `-setsar` options (Sample Aspect Ratio), which is the FFMPEG's equivalent of PAR.

Example formula Set SAR to 1:1 (Scaling):

```bash
ffmpeg -i YOUR_4:3_INPUT.mov -vf scale=1280x720,setsar=1:1 -c:a copy YOUR_16:9_OUTPUT.mov
```

- `-vf scale=1280x720`: "Video Filter Scale" and the 1280x720 are referred to the desired width and height output
- `-setsar=1:1`: Set the Pixel Aspect Ratio at 1:1 (Square)

Example formula Set SAR to 1:1

```bash
ffmpeg -i INPUT.mov -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -c:a copy OUTPUT.mov
```

- `-vf`: perform 2 distinct operations. The first will scale the input at 1280 (width) x 720 (height) and will preserve the original aspect ratio by scaling your input. The second (pad) will compute and insert a pillar box, so to produce a final 1280x720 output video.

Letterboxing will occur if your input's aspect ratio is wider than the output aspect ratio.

The word "iw" stands for "input width"; "ow" stands for "output width"; the word "ih" stands for "input height" and "oh" stands for output height. A mathematical expression is used to compute the size of the pillar/letter box, based on your input.

### The 9:16 Aspect Ratio

To produce a 9:16 video preserving the original aspect ratio you will have to invert the width with the height, as in this example formula for a 720x1280 video:

```bash
ffmpeg -i YOUR_16:9_INPUT.mov -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -c:a copy YOUR_9:16_OUTPUT.mov
```

### Colored Pillar/Letter Box

To change the color of the pillar/letter box bars, you can specify a value with the color option, such as in this example for producing red letterbox's bars:

```bash
ffmpeg -i INPUT.mov -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:color=red" OUTPUT.mov
```

### Crop

When you want to avoid Pillar/Letter Boxes you can use the crop option, as in this example:

```bash
ffmpeg -i YOUR_4:3_INPUT.mov -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" CROP_OUTPUT.mov
```

## Overlay Images on Video

Assuming that you are working with a Mp4 container and h264/AVC codec you just need to type:

```bash
ffmpeg -i input.mp4 -i logo.png -filter_complex "overlay=0:0" -codec:a copy output.mp4
```

- `-i input.mp4`: this is an example video called "input.mp4"
- `-i logo.png`: a second input is declared with an example "logo.png" file
- `-filter_complex "overlay=0:0"`: with this option you specify which filter to enable for the process

Depending on which image you need to overlay on your video, usually better results are achieved with transparent PNG graphics.

## Generate Waveforms from Audio

Generate the Waveform from your audio file, with this command:

```bash
ffmpeg -i MY_AUDIO.AAC -filter_complex "[0:a]showwaves=mode=cline:s=1920x1080[v]" -map '[v]' -map '0:a' -c:a copy -pix_fmt yuv420p MY_VIDEO.mp4
```

- `-i MY_AUDIO.AAC`: this is an example audio input file
- `-filter_complex`: this will call FFMPEG's Filter Complex Option
- `"[0:a]showwaves=mode=cline:s=1920x1080[v]"`: this will genereate the waveforms for a video in Full-HD (1920x1080). You can modify and insert any size you want, based on the destination of your video. The Audio Waveforms source will be taken from the stream number 0 (your input) and are named with an [a] standing for "audio", while the resulting video (called [v], for "video") will be passed on the next option.

- `-map '[v]' -map '0:a' -c:a copy`: The -MAP option will take the resulting 1920x1080 video '[v]' and merged with the audio track (your source file) in order to produce a final single file, wihout re-encoding your audio source (thus the -c:a copy in the command).

- `-pix_fmt yuv420p`: this command is used for playback compatibility with Quicktime player and other players which aren't build with FFMPEG, such as VLC Player.

- `MY_VIDEO.mp4`: this is an example output filename

To change color (for example white) you can add a colon (:) after the size specifier (s=1920x1080), like in the following formula:

```bash
ffmpeg -i MY_AUDIO.AAC -filter_complex "[0:a]showwaves=mode=cline:s=1920x1080:colors=white[v]" -map '[v]' -map '0:a' -c:a copy -pix_fmt yuv420p MY_VIDEO.mp4
```

**Style "Split Channels": The Left and the Right audio channels are visualized separately.**

```bash
ffmpeg -i MY_AUDIO.aac -filter_complex "[0:a]showwaves=split_channels=1:mode=cline:s=1920x1080[v]" -map '[v]' -map '0:a' -c:a copy -pix_fmt yuv420p MY_VIDEO.mp4
```

### Style "Show Volumes": This will generate the Audio Left + Audio Right Volume Animation based on your input audio

```bash
ffmpeg -i MY_AUDIO.aac -t 00:01:00 -filter_complex "[0:a]showvolume,scale=1920:-1,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v]" -map '[v]' -map '0:a' -c:a copy -pix_fmt yuv420p MY_VIDEO.mp4
```

**Style "Audio Frequency": to generate the Audio Frequency of your input source.**

```bash
ffmpeg -i MY_AUDIO.aac -t 00:01:00 -filter_complex "[0:a]showfreqs=s=1920x1080[v]" -map '[v]' -map '0:a' -c:a copy -pix_fmt yuv420p MY_VIDEO.mp4
```

**Style "Black & White Lines": this will generate a simple black and white Waveform by taking your audio source and draw a vertical line for each sample.**

```bash
ffmpeg -i MY_AUDIO.aac -filter_complex "[0:a]showwaves=mode=line:s=1920x1080:colors=white[v]" -map '[v]' -map '0:a' -c:a copy -pix_fmt yuv420p MY_VIDEO.mp4
```

**Style "Black & White Clines": this will generate a simple black and white waveform animation by taking your audio source and draw a centered vertical line for each sample.**

```bash
ffmpeg -i MY_AUDIO.aac -filter_complex "[0:a]showwaves=mode=cline:s=1920x1080:colors=white[v]" -map '[v]' -map '0:a' -c:a copy -pix_fmt yuv420p MY_VIDEO.mp4
```

## Extract Images from Video

Images extracted every 5 seconds

```bash
ffmpeg -i INPUT -f image2 -bt 20M -vf fps=1/5 %03d.png
```

- `-f image2`: this is the FFMPEG's image muxer and writes video frames to image files.
- `-bt 20M`: depending on your input's file format, this option will be required for PNG file format export and it's explained technically here. This option is called "Bitrate Tollerance" and in this example it's set at 20 Mbps.
- `-vf fps=1/45`: this is the time interval value that can be adjusted accordingly to your needs (in this example, 1 picture every 45 seconds). The same can be achieved with the -r (rate) option (-r 1/45).
- `%03d.png`: this will output a file titled with 3 digits, starting from "000.png"

Example formula for a specific width and height:

```bash
ffmpeg -i INPUT -r 1 -s 1280x720 -f image2 %03d.jpeg
```

- This will extract one video frame per second from the video and will output them in files named 000.jpg, 001.jpeg, etc. Images will be scaled to fit a specific (W)idth x (H)eight values, as in the above example at 1280x720.

## Extract Audio from Video

```bash
ffmpeg -i YOUR_VIDEO.mp4 -vn -c:a copy youraudio.aac
```

Taking the same example above, to extract an AAC audio track from a video and convert it to Mp3, you will need to type the following:

```bash
ffmpeg -i YOUR_VIDEO.mp4 -vn -c:a mp3 -b:a 128k -ac 2 -ar 48000 YOUR_AUDIO.mp3
```

- This will produce a standard Mp3 file at 128 Kbit/s, 48000 kHz and, if the source has multiple audio tracks, such as in the Dolby AC3 format, it will produce a stereo mixdown of the source video. You can modify the -b:a (bitrate), the -ar (Audio Rate) and the -ac (Audio Channels) parameters, accordingly to your needings.

## Replace Audio of a Video

```bash
ffmpeg -i your_source_video.mp4 -i your_source_audio.mp4 -map 0:v -map 1:a -c copy final.mp4
```

- `-map 0:v`: this will specify that the first input is the video source (FFMPEG starts counting from 0)
- `-map 1:a`: this will specify that the second input is the audio source
- `-c copy`: this command will avoid to re-encode the source fi les
- `final.mp4`: this is an output example file

## How to add an Overlay Banner and burn subtitles onto a video

Step 1: Create your desired banner with your favourite graphic software. Set the size. 1920x220 would be an exmple size for placing a header onto a Full-HD video.

Step 2: Export the graphic in PNG format

Step 3: Overlay the graphic on top of your video. In this example the desired overlay graphic will have a time of 10 seconds before disappearing.

```bash
ffmpeg -i videoinput.mp4 -i imageinput.png -filter_complex "[0:v][1:v] overlay=0:0:enable='between(t,0,10)'" -pix_fmt yuv420p -c:a copy output.mp4
```

We might then want to add the graphic overlay we generated in this example. So the formula for achieving this will be:

```bash
ffmpeg -i videoinput.mp4 -i yourgraphicheader.png -filter_complex "[0:v] [1:v] overlay=0:0:enable='between(t,0,10)',subtitles=sub.ass" -pix_fmt yuv420p -c:a copy output.mp4
```

Again: you can remove the following code if you want to have the graphic overlay across the entire duration of your video. The code will be:

```bash
ffmpeg -i videoinput.mp4 -i yourgraphicheader.png -filter_complex "[0:v] [1:v] overlay=0:0,subtitles=sub.ass" -pix_fmt yuv420p -c:a copy output.mp4
```

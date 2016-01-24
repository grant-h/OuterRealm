# Outer Realm

## Inspiration
I've been an avid follower of the demoscene for a while. I wanted to try my hand at creating my own audio visual production. The results were...less than spectacular.

## What it does
It's a linear, 3D graphic based, audio synced production.

## How I built it
In order to avoid working with native libraries, I used Three.JS (WebGL) for rendering and GNU Rocket for keyframing and music syncing.

## Challenges I ran into
GNU Rocket was harder to setup on OSX than it needed to be. I lost hours on this. Additionally, the JS connector interface was poorly documented and if used wrong wouldn't allow you to sync with the rocket track view. Also, JavaScript for OpenGL is quite terrible for some workloads (many objects) due to JavaScript's single threaded model. On native, this overhead would be much lower and I would have more control over the rendering pipeline. More control wasn't the point though, as I have never even started a good production due to the native OpenGL overhead / boilerplate. Overall, getting _something_ to work was an amazing accomplishment given my graphical inexperience.

## Accomplishments that I'm proud of
I finally got GNU Rocket running for the first time in my life and made a _teaser_ production. I was using a song without per-channel information, so I had to **manually** keyframe every interesting event, along with the camera. Needless to say, I couldn't keyframe everything.

## What I learned
Manual keyframing is hard, but thankfully GNU Rocket makes it feasible. Three.JS has major performance limitations involving GridHelper.

## What's next for Outer Realm
I hope to add more keyframes and more effects to bring this "demo" out of the '90s.

**NOTE: I CLAIM NO RIGHTS TO "Electromagnetic Blaze - Magnetic Midnight". THIS WAS NOT USED FOR COMMERCIAL PURPOSES AND I HAVE NOT PROFITED FROM USING THIS SONG IN ANY WAY.**

# Haptic Phoneme Encoder
Intended for use in study, not demo.

## How to use:
- Run on your computer by using `node app.js`
- Connect to a wifi network, and have all phones connect to the same network
- Find your inet ip address by running `ifconfig`. (Works on Linux but Windows/OSX may have different commands). The address you're looking for is usually in the form: NNN.NNN.NN.NN (N=Natural). It will typically *not* be the one with 0s in it. (e.g. 127.0.0.1).
- Access the program on your computer by navigating to `localhost:3000`
- Access the speaker side on your phone by navigating to `https://IPADDRESS:3000`
- Access the listener side on your phone by navigating to `https://IPADDRESS:3000/listener.html`
- Don't forget to include the `https` because some browsers will disable audio recording by default if not connected to https.
- Here's the part I totally don't understand but is nonetheless necessary: the speaker must access the website through Firefox, while the listener must access the website through Chrome. Why is this? The answer eludes me. It works fine on desktop, but on mobile for some reason it completely breaks if not on these two different browsers. Since this is a small study and this version will not be used to demo... This will be "good enough"
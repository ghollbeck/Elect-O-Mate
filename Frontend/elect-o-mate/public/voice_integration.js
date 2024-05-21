const assistant = '64c5e492-c8c7-4400-9de0-1d159b5e392b';
const buttonConfig = {
  position: 'bottom-right', // "bottom" | "top" | "left" | "right" | "top-right" | "top-left" | "bottom-left" | "bottom-right"
  offset: '40px', // decide how far the button should be from the edge
  width: '50px', // min-width of the button
  height: '50px', // height of the button
  idle: {
    // button state when the call is not active.
    color: `rgb(93, 254, 202)`,
    type: 'pill', // or "round"
    title: 'Ready to talk?', // only required in case of Pill
    subtitle: 'Talk with our AI assistant', // only required in case of pill
    icon: `https://unpkg.com/lucide-static@0.321.0/icons/phone.svg`,
  },
  loading: {
    // button state when the call is connecting
    color: `rgb(93, 124, 202)`,
    type: 'pill', // or "round"
    title: 'Connecting...', // only required in case of Pill
    subtitle: 'Please wait', // only required in case of pill
    icon: `https://unpkg.com/lucide-static@0.321.0/icons/loader-2.svg`,
  },
  active: {
    // button state when the call is in progress or active.
    color: `rgb(255, 0, 0)`,
    type: 'pill', // or "round"
    title: 'Call is in progress...', // only required in case of Pill
    subtitle: 'End the call.', // only required in case of pill
    icon: `https://unpkg.com/lucide-static@0.321.0/icons/phone-off.svg`,
  },
};

(function (d, t) {
  var g = document.createElement(t),
    s = d.getElementsByTagName(t)[0];
  g.src =
    'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
  g.defer = true;
  g.async = true;
  s.parentNode.insertBefore(g, s);

  g.onload = function () {
    const vapi = window.vapiSDK.run({
      apiKey: '13bb64f7-b898-4a96-bdbc-533d7d0f2922', // required Use your Public Key
      assistant: assistant, // required
      config: buttonConfig, // optional
    });

    if (vapi) {
      // Extend more using vapi
    }
  };
})(document, 'script');

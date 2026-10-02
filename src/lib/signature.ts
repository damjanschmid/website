// Shown at the top of the page source. Say hi to whoever opens view-source.
export const signature = String.raw`
<!-------------------------------------------------------

 ________  ________  _____ ______         ___  ________  ________
|\   ___ \|\   __  \|\   _ \  _   \      |\  \|\   __  \|\   ___  \
\ \  \_|\ \ \  \|\  \ \  \\\__\ \  \     \ \  \ \  \|\  \ \  \\ \  \
 \ \  \ \\ \ \   __  \ \  \\|__| \  \  __ \ \  \ \   __  \ \  \\ \  \
  \ \  \_\\ \ \  \ \  \ \  \    \ \  \|\  \\_\  \ \  \ \  \ \  \\ \  \
   \ \_______\ \__\ \__\ \__\    \ \__\ \________\ \__\ \__\ \__\\ \__\
    \|_______|\|__|\|__|\|__|     \|__|\|________|\|__|\|__|\|__| \|__|


made by Damjan :)
https://www.damjanschmid.ch/

-------------------------------------------------------->
`;

// With scripting on, browsers parse <noscript> contents as raw text, so the
// comment above never becomes a comment node. This lifts it into one and
// places it as the first child of <html>, before <head>. The noscript stays
// put so hydration still finds the element React rendered.
export const signatureScript = String.raw`
(function(){var n=document.getElementById("signature");if(!n)return;
var t=n.textContent.replace(/^\s*<!--/,"").replace(/-->\s*$/,"");
document.documentElement.insertBefore(document.createComment(t),document.head);})();
`;

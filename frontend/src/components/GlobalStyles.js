import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  :root {
    --color-active: #0195f6;
    --color-success: #66bb6a;
    --color-offwhite: #fafafa;
    --color-white: #ffffff;
    --color-black: #000000;
    --color-text: grey;
    --color-dark-text: darkgrey;
    --font-logo: 'Kaushan Script', cursive;
    --font-body: 'Nunito', sans-serif;
    --padding-page: 24px;
  }

  /* http://meyerweb.com/eric/tools/css/reset/
      v2.0 | 20110126
      License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      font-size: 100%;
      vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
      display: block;
  }
  body {
      line-height: 1;
  }
  ol, ul {
      list-style: none;
  }
  blockquote, q {
      quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
      content: '';
      content: none;
  }

  h1,
h2,
h3,
label 
{
  color: #fff;
  font-family: var(--font-logo);
  font-size: 32px;
  text-align: center;
}
p,
a,
li,
blockquote,
input,
button,
div {
  font-family: var(--font-body);
  text-decoration: none;
}

.in{
  width: 60%;
  height: 40px;
  background-color: var(--color-offwhite);
  border-radius: 0.1cm;
  border: 1px solid lightgray;
  text-indent: 10px;
  box-sizing: border-box;
}

.cbtn{
    color: var(--color-white);
    background-color: var(--color-active);
    border-radius: 0.1cm;
    border: none;
    font-weight: bold;
    cursor: pointer;
}
`;

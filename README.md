# msc-stretch-textarea

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-stretch-textarea) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/19731/branches/516231/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=19731&bid=516231)

Users used to experience autogrowing &lt;textarea /&gt; since Facebook announced this fancy effect. There are so many skills to apply this effect in web page. Here comes [the most cleanest trick for autogrowing textareas](https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/).

With this trick, decvelopers could apply [CSS > Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) to make &lt;textarea /&gt; autogrowing with fewest event listeners. Very smart &amp; bravo !! &lt;msc-stretch-textarea /&gt; is a web component which wrap this trick to let developers could easy adopt this effect in web page instead of annoying HTML code &amp; CSS setting. 

All we need to do is just make a few setting and everything will be all set.

![<msc-stretch-textarea />](https://blog.lalacube.com/mei/img/preview/msc-stretch-textarea.png)

## Basic Usage

&lt;msc-stretch-textarea /&gt; is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-stretch-textarea /&gt;'s html structure and everything will be all set.

- Required Script

```html
<script 
  type="module"
  src="https://your-domain/wc-msc-stretch-textarea.js"
</script>
```

- Structure

Put &lt;msc-stretch-textarea /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-stretch-textarea>
  <script type="application/json">
    {
      "name": "my-stretch-textarea",
      "value": "default content",
      "maxLength": 300,
      "placeholder": "placeholder",
      "pattern": "",
      "disabled": false,
      "readOnly": false,
      "required": true 
    }
  </script>
</msc-stretch-textarea>
```

Or set attributes directly.

```html
<msc-stretch-textarea
  name="my-stretch-textarea"
  value="default content"
  maxlength="300"
  placeholder="placeholder"
  required
></msc-stretch-textarea>
```

Developers could also put &lt;textarea /> inside &lt;msc-stretch-textarea /> as its child.

```html
<msc-stretch-textarea>
  <textarea
    name="my-stretch-textarea"
    maxlength="300"
    placeholder="placeholder"
    required
  >
    default content
  </textarea>
</msc-stretch-textarea>
```

Otherwise, developers could also choose remoteconfig to fetch config for &lt;msc-stretch-textarea />.

```html
<msc-stretch-textarea
  remoteconfig="https://your-domain/api-path"
  ...
></msc-stretch-textarea>
```

## JavaScript Instantiation

&lt;msc-stretch-textarea /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscStretchTextarea } from 'https://your-domain/wc-msc-stretch-textarea.js';

//use DOM api
const nodeA = document.createElement('msc-stretch-textarea');
document.body.appendChild(nodeA);
nodeA.name = "my-stretch-textarea";
nodeA.maxLength = 300;

// new instance with Class
const nodeB = new MscStretchTextarea();
document.body.appendChild(nodeB);
nodeB.name = "my-stretch-textarea";
nodeB.maxLength =300;

// new instance with Class & default config
const config = {
  name: "my-stretch-textarea",
  maxLength: 300
};
const nodeC = new MscStretchTextarea(config);
document.body.appendChild(nodeC);
</script>
```

## Style Customization

&lt;msc-stretch-textarea /> uses CSS variables to hook uploader trigger theme & drop zone. That means developer could easy change it into the looks you like.

```html
<style>
msc-stretch-textarea {
  /* textarea basic font setting */
  --msc-stretch-textarea-font-size: 16px;
  --msc-stretch-textarea-font-weight: 400;
  --msc-stretch-textarea-color: #000;
  --msc-stretch-textarea-line-height: 1;
  --msc-stretch-textarea-letter-spacing: normal;

  /* textarea > placeholder font setting */
  --msc-stretch-textarea-placeholder-font-size: var(--msc-stretch-textarea-font-size);
  --msc-stretch-textarea-placeholder-font-weight: var(--msc-stretch-textarea-font-weight);
  --msc-stretch-textarea-placeholder-color: currentColor;
  --msc-stretch-textarea-placeholder-line-height: var(--msc-stretch-textarea-line-height);

  /* textarea others setting */
  --msc-stretch-textarea-background: transparent;
  --msc-stretch-textarea-min-block-size: 0;
  --msc-stretch-textarea-padding: 8px;
  --msc-stretch-textarea-margin: 0;
  --msc-stretch-textarea-box-sizing: border-box;
  --msc-stretch-textarea-border: 0 none;
  --msc-stretch-textarea-border-radius: 0;
  --msc-stretch-textarea-box-shadow: none;
  --msc-stretch-textarea-transition: initial;
  --msc-stretch-textarea-caret-color: var(--msc-stretch-textarea-color);
  --msc-stretch-textarea-accent-color: auto;
  --msc-stretch-textarea-selection-color: initial;
  --msc-stretch-textarea-selection-background: initial;
}
</style>
```

## Attributes

&lt;<msc-stretch-textarea /> supports some attributes to let it become more convenience & useful.

- **name**

Set name for &lt;textarea />. Default is `empty string`.

```html
<msc-stretch-textarea
  name="my-stretch-textarea"
  ...
></msc-stretch-textarea>
```

- **value**

Set value for &lt;textarea />. Default is `empty string`.

```html
<msc-stretch-textarea
  value="default content"
  ...
></msc-stretch-textarea>
```

- **maxlength**

Set maxlength for &lt;textarea />. Default is `-1`.

```html
<msc-stretch-textarea
  maxlength="300"
  ...
></msc-stretch-textarea>
```

- **placeholder**

Set placeholder for &lt;textarea />. Default is `empty string`.

```html
<msc-stretch-textarea
  placeholder="placeholder"
  ...
></msc-stretch-textarea>
```

- **pattern**

Set pattern for &lt;textarea />. Default is `empty string`.

```html
<msc-stretch-textarea
  pattern="[a-z]{4,8}"
  ...
></msc-stretch-textarea>
```

- **disabled**

Set disabled for &lt;textarea />. Default is `false` (not set).

```html
<msc-stretch-textarea
  disabled
  ...
></msc-stretch-textarea>
```

- **readonly**

Set readonly for &lttextarea />. Default is `false` (not set).

```html
<msc-stretch-textarea
  readonly
  ...
></msc-stretch-textarea>
```

- **required**

Set required for &lt;textarea />. Default is `false` (not set).

```html
<msc-stretch-textarea
  required
  ...
></msc-stretch-textarea>
```

## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| name | String | etter for name. Default is `empty string`. |
| value | String | Getter / Setter for value. Default is `empty string`. |
| maxLength | Number | Getter / Setter for maxLength. Default is `-1`. |
| placeholder | String | Getter / Setter for placeholder. Default is `empty string`. |
| pattern | String | Getter / Setter for pattern. Default is `empty string`. |
| disabled | Boolean | Getter / Setter for disabled. Default is `false`. |
| readOnly | Boolean | Getter / Setter for disabled. Default is `false`. |
| required | Boolean | Getter / Setter for disabled. Default is `false`. |


## Events

| Event Signature | Description |
| ----------- | ----------- |
| msc-stretch-textarea-input | Fired when <msc-stretch-textarea /> inputed. |
| msc-stretch-textarea-invalid | Fired when &lt;msc-stretch-textarea /> invalid. Developers could get original click event from `event.detail.baseEvent` to do preventDefault behavior.|

## Reference
- [&lt;msc-stretch-textarea /&gt;](https://blog.lalacube.com/mei/webComponent_msc-stretch-textarea.html)

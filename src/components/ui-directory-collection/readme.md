# ui-directory-collection

<!-- Auto Generated Below -->

## Usage

### Ui-directoy-segment-usage

# How to use `ui-directory-collection`

```html
<ui-directory-collection>
  <ui-directory-segment mark="Segment 1" data='{"product": 1, "name": "Product Name 1"}'>
    <div>Recusandae quod aspernatur vitae ut adipisci ut.</div>
  </ui-directory-segment>
  <ui-directory-segment mark="Segment 2" data='{"product": 2, "name": "Product Name 2"}'>
    <div>Recusandae quod aspernatur vitae ut adipisci ut.</div>
  </ui-directory-segment>
  <!-- ... -->
</ui-directory-collection>
```

## Properties

| Property | Attribute | Description                                   | Type                                        | Default    |
| -------- | --------- | --------------------------------------------- | ------------------------------------------- | ---------- |
| `alignX` | `align-x` | Horizontal alignment for scrolling into view. | `"center" \| "end" \| "nearest" \| "start"` | `'center'` |
| `alignY` | `align-y` | Vertical alignment for scrolling into view.   | `"center" \| "end" \| "nearest" \| "start"` | `'center'` |

## Events

| Event                                | Description                                    | Type                                                |
| ------------------------------------ | ---------------------------------------------- | --------------------------------------------------- |
| `uiDirectoryCollectionSegmentChange` | Event emitted when the active segment changes. | `CustomEvent<UiDirectoryCollectionChangeEventData>` |

## Shadow Parts

| Part         | Description |
| ------------ | ----------- |
| `"label"`    |             |
| `"marks"`    |             |
| `"segments"` |             |

---

©2025 cgoern

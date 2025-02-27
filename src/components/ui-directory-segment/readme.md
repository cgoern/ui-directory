# ui-directory-segment

<!-- Auto Generated Below -->

## Usage

### Ui-directoy-segment-usage

# How to use `ui-directory-segment`

```html
<ui-directory-segment mark="Segment" data='{"product": 1, "name": "Product Name 1"}'>
  <div>Recusandae quod aspernatur vitae ut adipisci ut.</div>
</ui-directory-segment>
```

## Properties

| Property            | Attribute | Description                                 | Type     | Default     |
| ------------------- | --------- | ------------------------------------------- | -------- | ----------- |
| `data`              | `data`    | Data to be used within the expansion panel. | `string` | `null`      |
| `mark` _(required)_ | `mark`    | A unique identifier for the segment.        | `string` | `undefined` |

## Methods

### `activate() => Promise<void>`

Activates the segment by setting the `active` property to true.

#### Returns

Type: `Promise<void>`

### `deactivate() => Promise<void>`

Deactivates the segment by setting the `active` property to false.

#### Returns

Type: `Promise<void>`

### `getData() => Promise<unknown | null>`

Retrieves the parsed data associated with this segment.

#### Returns

Type: `Promise<unknown>`

A promise that resolves to the parsed data or null

---

©2025 cgoern

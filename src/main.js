import DatoCmsPlugin from "datocms-plugins-sdk";
import Field from "./Field.svelte";
import { config } from "./jetshop";
import { items } from "./store";

function itemsFromJSON(value) {
  try {
    return JSON.parse(value) || [];
  } catch (e) {
    return [];
  }
}

DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer();

  const contentTypes = [];

  function updateItems() {
    const value = plugin.getFieldValue(plugin.fieldPath);
    items.set(itemsFromJSON(value));
  }

  // Set items to initial value
  updateItems();

  // Listen to changes from other users that affect this field
  plugin.addFieldChangeListener(plugin.fieldPath, updateItems);

  // Listen to changes in the svelte store and set them in DatoCMS
  items.subscribe((newItems) => {
    try {
      const newValue = JSON.stringify(newItems);
      const oldValue = JSON.stringify(
        JSON.parse(plugin.getFieldValue(plugin.fieldPath))
      );

      if (newValue !== oldValue) {
        plugin.setFieldValue(plugin.fieldPath, newValue);
      }
    } catch (e) {}
  });

  if (plugin.parameters.global) {
    const channel =
      (plugin.parameters.global.locales &&
        plugin.parameters.global.locales[plugin.locale]) ||
      1;

    config(
      plugin.parameters.global.token,
      plugin.parameters.global.shopid,
      channel
    );
  }

  if (plugin.parameters.instance.searchProducts) contentTypes.push("products");
  if (plugin.parameters.instance.searchCategories)
    contentTypes.push("categories");
  if (plugin.parameters.instance.searchContentPages)
    contentTypes.push("contentPages");

  let minItems = 0,
    maxItems = -1;

  if (plugin.parameters.instance.minItems)
    minItems = plugin.parameters.instance.minItems;
  if (plugin.parameters.instance.maxItems)
    maxItems = plugin.parameters.instance.maxItems;

  new Field({
    target: document.body,
    props: {
      placeholder: plugin.placeholder,
      contentTypes,
      minItems,
      maxItems,
    },
  });
});

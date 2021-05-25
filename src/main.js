import DatoCmsPlugin from "datocms-plugins-sdk";
import Field from "./Field.svelte";
import { config } from "./jetshop";
import { value } from "./store";

DatoCmsPlugin.init((plugin) => {
  plugin.startAutoResizer();

  const contentTypes = [];

  const val = plugin.getFieldValue(plugin.fieldPath);

  if (val) {
    value.set(val);
  }

  plugin.addFieldChangeListener(plugin.fieldPath, () =>
    value.set(plugin.getFieldValue(plugin.fieldPath))
  );

  value.subscribe((newVal) => plugin.setFieldValue(plugin.fieldPath, newVal));

  if (plugin.parameters.global) {
    config(plugin.parameters.global.token, plugin.parameters.global.shopid);
  }

  if (plugin.parameters.instance.showProducts) contentTypes.push("products");
  if (plugin.parameters.instance.showCategories)
    contentTypes.push("categories");
  if (plugin.parameters.instance.showContentPages)
    contentTypes.push("contentPages");

  new Field({
    target: document.body,
    props: {
      placeholder: plugin.placeholder,
      contentTypes,
    },
  });
});

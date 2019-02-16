export const updateGraphicProps = (graphic, props) => {
  const graphicsData = graphic.graphicsData;
  const keys = Object.keys(props);
  const jlen = keys.length;
  let i;
  let j;
  let ilen;
  let key;
  let shape;
  // Update the props on the graphic.
  for (j = 0; j < jlen; j++) {
    key = keys[j];
    graphic[key] = props[key];
  }
  // Update the props for each shape.
  for (i = 0, ilen = graphicsData.length; i < ilen; i++) {
    shape = graphicsData[i];
    for (j = 0; j < jlen; j++) {
      key = keys[j];
      shape[key] = props[key];
    }
  }
  graphic.dirty++;
  graphic.clearDirty++;
}

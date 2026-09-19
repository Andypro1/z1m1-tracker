export const fittedMapArea = (width, height, aspect) => {
  if (width <= 0 || height <= 0 || aspect <= 0) return 0;
  const fittedWidth = Math.min(width, height * aspect);
  return (fittedWidth * fittedWidth) / aspect;
};

const growBars = (space, controlsOpen, areasOpen) => {
  const controlWeight = controlsOpen ? 3 : 0;
  const areaWeight = areasOpen ? 2 : 0;
  const totalWeight = controlWeight + areaWeight;
  return totalWeight
    ? [
        (space * controlWeight) / totalWeight,
        (space * areaWeight) / totalWeight,
      ]
    : [0, 0];
};

const horizontalFit = ({
  width,
  height,
  aspect,
  controlsOpen,
  areasOpen,
  rem,
}) => {
  const collapsed = 2.75 * rem;
  const controlMinimum = controlsOpen
    ? (width <= 700 ? 16.25 : 10) * rem
    : collapsed;
  const areaMinimum = areasOpen ? 7 * rem : collapsed;
  const mapHeight = Math.min(
    Math.max(0, height - controlMinimum - areaMinimum),
    width / aspect,
  );
  const mapWidth = mapHeight * aspect;
  const [controlGrowth, areaGrowth] = growBars(
    Math.max(0, height - mapHeight - controlMinimum - areaMinimum),
    controlsOpen,
    areasOpen,
  );
  return {
    layout: "horizontal",
    mapArea: mapWidth * mapHeight,
    mapWidth,
    mapHeight,
    controlSize: controlMinimum + controlGrowth,
    areaSize: areaMinimum + areaGrowth,
  };
};

const verticalFit = ({
  width,
  height,
  aspect,
  controlsOpen,
  areasOpen,
  rem,
}) => {
  const collapsed = 2.75 * rem;
  const controlMinimum = controlsOpen ? 12 * rem : collapsed;
  const areaMinimum = areasOpen ? 9 * rem : collapsed;
  const mapWidth = Math.min(
    Math.max(0, width - controlMinimum - areaMinimum),
    height * aspect,
  );
  const mapHeight = mapWidth / aspect;
  const [controlGrowth, areaGrowth] = growBars(
    Math.max(0, width - mapWidth - controlMinimum - areaMinimum),
    controlsOpen,
    areasOpen,
  );
  return {
    layout: "vertical",
    mapArea: mapWidth * mapHeight,
    mapWidth,
    mapHeight,
    controlSize: controlMinimum + controlGrowth,
    areaSize: areaMinimum + areaGrowth,
  };
};

export const solveMapLayout = (options) => {
  const normalized = { rem: 16, ...options };
  const horizontal = horizontalFit(normalized);
  const vertical = verticalFit(normalized);
  return vertical.mapArea > horizontal.mapArea ? vertical : horizontal;
};

export const chooseMapLayout = (options) => solveMapLayout(options).layout;

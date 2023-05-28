import consts from "./const";
import {
  Canvg,
  presets
} from 'canvg';

const filterKeys = Object.keys(consts.filters);

export const prettyUrlEncode = (string => string.replace(/\s+/g, '_').toLowerCase());
export const prettyUrlDecode = (string => string.replace(/_/g, ' '));

export const prettyNumberFormat = (number, isCompact=true, isCurrency=false, asPercent=false) => {
  const options = {};
  if (isCompact) {
    options.notation = "compact"
  }
  if (isCurrency) {
    options.style = "currency";
    options.currency = "USD";
  }
  if (asPercent) {
      options.style = 'percent';
      options.minimumFractionDigits = 0;
      options.maximumFractionDigits = 0;
  }
  return new Intl.NumberFormat('en-US', options).format(number);
}

export const getCountyDetailsUrl = (selectedCounty) => {
  return selectedCounty 
    ? `/explore/us/${prettyUrlEncode(selectedCounty[consts.dbFields.stateAbbreviation])}/${prettyUrlEncode(selectedCounty[consts.dbFields.name])}`
    : null;

}

export const setRouteParams = (newQuery, router, setLoading, scroll=false) => {
  setLoading && setLoading(true);
  if (Object.keys(newQuery).length == 0) {
    router.push(router.pathname, undefined, { shallow: true })
  } else {
    router.push(
      {pathname: router.pathname, query: newQuery},
      undefined,
      {scroll, shallow: true }
      )
  }
}

export const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

export const meetsCriteria = (countyDatum, routerQuery) => {
  if (!countyDatum || !routerQuery) {
    return false;
  }
  for (const key of filterKeys) {
    const filter = consts.filters[key]
    const urlKey = filter.urlKey;
    const csvKey = filter.csvKey;
    const compareMode = filter.compareMode;
    const valueFromUrl = routerQuery[urlKey];
    
    if (valueFromUrl) {
      const valueFromCsv = countyDatum[csvKey];
      switch (compareMode) {
        case consts.compareModes.lessThan:
          if (!valueFromCsv || valueFromCsv > parseFloat(valueFromUrl)) {
            return false;
          }
          break;
        case consts.compareModes.greaterThan:
          if (!valueFromCsv || valueFromCsv < parseFloat(valueFromUrl)) {
            return false;
          }
          break;
        case consts.compareModes.between:
          const valueFromUrlSplit = valueFromUrl.split(consts.urlBetweenSymbol);
          if (
            !valueFromCsv
            || (
              (valueFromUrlSplit[0] && valueFromCsv < valueFromUrlSplit[0])
              || (valueFromUrlSplit[1] && valueFromCsv > valueFromUrlSplit[1])
            )
          ) {
            return false;
          }
          break;
          case consts.compareModes.multipleChoice:
            const valuesFromUrl = valueFromUrl.split(consts.urlArrayDelimiter);
            if (valuesFromUrl != consts.allOption.value && !valuesFromUrl.includes(valueFromCsv)) {
              return false;
            }
            break;
          case consts.compareModes.multipleChoiceMappedToValues:
            const valuesFromUrl2 = valueFromUrl.split(consts.urlArrayDelimiter);
            const filterOptions = filter.options;
            let hasMatch = false;
            for (let index = 0; index < valuesFromUrl2.length; index++) {
              const urlValue = valuesFromUrl2[index];
              const thisOption = filterOptions.find(option => option.value === urlValue);
              if (urlValue === consts.allOption.value) {
                hasMatch = true;
              } else if (
                  (!thisOption.minimumValue || valueFromCsv > thisOption.minimumValue)
                  && (!thisOption.maximumValue || valueFromCsv <= thisOption.maximumValue)
               ) {
                hasMatch = true;
              }
            }
            if (!hasMatch) {
              return false;
            }
            break;
          case consts.compareModes.singleChoice:
            const csvFilterValues = valueFromUrl && filter.options[valueFromUrl] && filter.options[valueFromUrl].csvValues;
            if (valueFromUrl && valueFromUrl != consts.allOption.value && !csvFilterValues.includes(valueFromCsv)) {
              return false;
            }
            break;
          case consts.compareModes.boolean:
          const trueValue = filter.trueValue;
          if (valueFromUrl && valueFromUrl == consts.defaultUrlTrueValue && valueFromCsv != trueValue) {
            return false;
          }
          break;
        default:
          break;
        }
    }
  }
  return true;
}

export const arrayOfObjectsToMap = (array, mapKeyName) => {
  return array.reduce(function(mapAccumulator, objFromArray) {
    mapAccumulator[objFromArray[mapKeyName]] = objFromArray;
    return mapAccumulator;
  }, {});
}

export const getMaxValuesMap = (arrayOfObjects) => {
  const fieldNames = Object.keys(arrayOfObjects[0]);
  const maxValueMap = {};
  arrayOfObjects.forEach(item => {
    fieldNames.forEach(fieldName => {
      if (!maxValueMap[fieldName] || maxValueMap[fieldName] < item[fieldName]) {
        maxValueMap[fieldName] = item[fieldName];
      }
    })
  })
  return maxValueMap;
}

export const getDateFromFieldName = (fieldName) => {
  const splitFieldName = fieldName.split('_');
  // return new Date(splitFieldName[1], splitFieldName[2], splitFieldName[3]);
  return `${splitFieldName[1]}-${splitFieldName[2]}-${splitFieldName[3]}`
}

const getSvgUrl = (svgEl) => {
  svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgEl.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  return svgUrl;
}

const getSvgString = (svg) => {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  return svgStr;
}

const downloadImageFromUrl = (imageUrl, filename) => {
  var downloadLink = document.createElement("a");
  downloadLink.href = imageUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export const saveSvg = (svgEl, name) => {
  var svgUrl = getSvgUrl(svgEl);
  downloadImageFromUrl(svgUrl, name);
}

export const downloadPngFromCanvas = (canvas) => {
  var imgUrl = canvas.toDataURL("image/png");
  downloadImageFromUrl(imgUrl, 'my_movemap');
}

export const getPngFileBlobFromCanvas = (canvas, callback) => {
  return canvas.toBlob(callback, "image/png");
}

export const copyCanvasContentsToClipboard = (canvas, onDone, onError) => {
  canvas.toBlob(function (blob) {
    let data = [new ClipboardItem({ [blob.type]: blob })];

    navigator.clipboard.write(data).then(function () {
      onDone();
    }, function (err) {
      onError(err);
    })
  });
}

export const renderSvgToCanvas = async (svg, canvasId) => {
  const svgStr = getSvgString(svg);
  const canvas = document.querySelector(`#${canvasId}`);
  const ctx = canvas.getContext('2d');
  
  const v = await Canvg.fromString(ctx, svgStr, {});
  await v.start();
  return canvas;
}

export const copyTextToClipboard = (text) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
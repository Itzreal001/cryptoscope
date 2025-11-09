// Minimal reportWebVitals implementation compatible with Create React App
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch((e) => {
      // swallow import error during environments without web-vitals
      // (keeps behavior minimal and non-blocking)
      // console.warn('web-vitals not available', e);
    });
  }
};

export default reportWebVitals;

const logError = (message: any, ...optionalParams: any[]) => {
  if (!isProduction()) {
    console.error(message, optionalParams);
  }
};

const logWarning = (message: any, ...optionalParams: any[]) => {
  if (!isProduction()) {
    console.warn(message, optionalParams);
  }
};

const logInfo = (message: any, ...optionalParams: any[]) => {
  if (!isProduction()) {
    console.info(message, optionalParams);
  }
};

const log = (message: any, ...optionalParams: any[]) => {
  if (!isProduction()) {
    console.log(message, optionalParams);
  }
};

const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export { logError, logWarning, logInfo, log };

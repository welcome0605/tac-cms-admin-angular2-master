// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  s3ApiUrl: "https://i12ndfm2oh.execute-api.us-west-2.amazonaws.com/Prod",
  baseUrl: "http://192.168.100.125:8000",
  apiUrl: "http://192.168.100.125:8000/api/",
  defaultIcon:"http://127.0.0.1:8000/upload/menu_icon/thumb/default.png"
};

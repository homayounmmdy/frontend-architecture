/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-cross-module-dependency",
      comment:
        "Feature modules can only depend on themselves, shared, or authentication.",
      severity: "error",
      from: {
        path: "^src/modules/(?!authentication/)([^/]+)/",
      },
      to: {
        path: "^src/modules/(?!authentication/)[^/]+/",
        pathNot: "^src/modules/$1/",
      },
    },
    {
      name: "no-platform-to-feature",
      comment:
        "Shared and authentication are platform concerns and must not import feature modules.",
      severity: "error",
      from: {
        path: "^src/(shared|modules/authentication)/",
      },
      to: {
        path: "^src/modules/(?!authentication/)[^/]+/",
      },
    },
    //   {
    //     name: "shared-minimum-dependents",
    //     comment:
    //       "Shared modules should be depended on by at least 2 modules.",
    //     severity: "error",
    //     module: {
    //       path: "^src/shared/",
    //       numberOfDependentsLessThan: 2, // <- Change this to "1" to check if any modules are actually used
    //     },
    //     from: {
    //       path: "^src/",
    //     },
    //   },
    // ],
    // required: [
    //   {
    //     name: "module-api-must-use-shared-client",
    //     comment:
    //       "Module API files must use the shared API client.",
    //     severity: "error",
    //     module: {
    //       path: "^src/modules/[^/]+/api/",
    //     },
    //     to: {
    //       path: "^src/shared/api/client(\\.tsx?)?$",
    //     },
    //   },
  ],
  options: {
    includeOnly: "^src",
    // tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    doNotFollow: {
      path: "node_modules",
    },
    exclude: "node_modules|dist",
  },
};

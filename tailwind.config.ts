import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      /** WIP: try to apply logical and physical prop mapping */
      const USELOGICALPROPS = false;

      const physicalSidesXAlias = ["r", "l"] as const;
      const physicalSidesYAlias = ["t", "b"] as const;

      const physicalCornersAlias = physicalSidesYAlias.flatMap((y) =>
        physicalSidesXAlias.map((x) => `${y}${x}` as const)
      );

      if (USELOGICALPROPS) {
        const logicalAxis = ["b", "i"] as const;
        const physicalAxis = ["x", "y"] as const;
        const position = ["s", "e"] as const;

        const logicalSides = position.flatMap((pos) =>
          logicalAxis.map((ax) => `${ax}${pos}` as const)
        );
        const physicalSides = position.flatMap((pos) =>
          physicalAxis.map((ax) => `${ax}${pos}` as const)
        );

        const sides = [...logicalSides, ...physicalSides];
        type Side = (typeof sides)[number];

        const logicalCorners = logicalSides.flatMap((side) =>
          position.map((pos) => `${side}${pos}` as const)
        );

        const physicalCorners = physicalSides.flatMap((side) =>
          position.map((pos) => `${side}${pos}` as const)
        );

        /** possible corners - mapping */
        // ies == bse == tr == xsys
        // iss == bss == tl == xsye
        // ise == bes == bl == xeys
        // iee == bee == br == xeye

        const corners = [...logicalCorners, ...physicalCorners];
        const positionModifiers = [...sides, ...corners];
      }

      const positionModifiers = [
        ...physicalSidesXAlias,
        ...physicalSidesYAlias,
        ...physicalCornersAlias,
      ];

      matchUtilities(
        {
          "clip-inset-radius": (value, { modifier }) => {
            // function getRadius(
            //   v: string,
            //   m?: (typeof positionModifiers)[number]
            // ) {
            //   let tl,
            //     tr,
            //     br,
            //     bl = 0;

            //   if (m.length === 1) {
            //     m;
            //   }

            //   return `${tl} ${tr} ${br} ${bl}`;
            // }

            return {
              "--tw-inset-border-radius": `${value}`,
              "clip-path": `inset(var(--tw-inset, 0) round var(--tw-inset-border-radius))`,
            };
          },
        },
        {
          values: theme("borderRadius"),
          modifiers: positionModifiers.reduce(
            (acc, v) => ({ ...acc, [v]: v }),
            {}
          ),
        }
      );
    }),
  ],
};

export default config;

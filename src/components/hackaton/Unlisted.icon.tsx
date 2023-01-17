import { FC } from "react";

import { IIcons } from "./IIcons";

const UnlistedIcon: FC<IIcons> = ({
  width = 68,
  height = 68,
  color = "#141414",
  ...props
}) => (
  <svg width={width} height={height} viewBox="0 0 68 68" fill="none" {...props}>
    <path
      d="M46.5864 0V0.182397C47.7381 2.34507 54.3912 19.3616 54.3912 19.3616H56.5364C56.5364 19.3616 63.1895 2.34681 64.3412 0.182397V0H46.5864Z"
      fill={color}
    />
    <path
      d="M54.4311 51.786C52.569 58.8195 46.9356 63.9039 37.3069 63.9039C27.9336 63.9039 21.1069 58.8976 21.1069 44.7004V16.4884C21.1069 8.93556 22.2898 4.83952 24.7478 0.198022V0.015625H7V0.198022C10.0034 5.84008 10.6409 8.93556 10.6409 16.4884V44.9749C10.6409 61.3556 22.0171 68 35.4865 68C48.7161 68 54.7334 61.3956 57.0507 52.559L54.4311 51.786Z"
      fill={color}
    />
  </svg>
);

export default UnlistedIcon;

import { FC } from 'react';
import TimezoneSelect, { ITimezoneOption } from 'react-timezone-select';

interface Props {
  initialTimeZone: string;
  onChange: ((timezone: ITimezoneOption) => void) | undefined;
}

export const TimezoneCustomSelect: FC<Props> = ({
  initialTimeZone,
  onChange,
}) => {
  return <TimezoneSelect value={initialTimeZone} onChange={onChange} />;
};

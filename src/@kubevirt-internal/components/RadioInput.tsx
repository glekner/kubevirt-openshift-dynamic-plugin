import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';

export type RadioInputProps = {
  checked: boolean;
  desc?: string | JSX.Element;
  onChange: (v: any) => void;
  subTitle?: string | JSX.Element;
  value: any;
  disabled?: boolean;
  inline?: boolean;
} & React.InputHTMLAttributes<any>;

export const RadioInput: React.FC<RadioInputProps> = (props) => {
  const inputProps: React.InputHTMLAttributes<any> = _.omit(props, [
    'title',
    'subTitle',
    'desc',
    'children',
    'inline',
  ]);
  const inputElement = (
    <>
      <label
        className={classNames({ 'radio-inline': props.inline, 'co-disabled': props.disabled })}
      >
        <input type="radio" {...inputProps} data-test={`${props.title}-radio-input`} />
        {props.title} {props.subTitle && <span className="co-no-bold">{props.subTitle}</span>}
      </label>
      {props.desc && <p className="co-m-radio-desc text-muted">{props.desc}</p>}
      {props.children}
    </>
  );

  return props.inline ? inputElement : <div className="radio">{inputElement}</div>;
};

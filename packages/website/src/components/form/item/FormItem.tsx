import { CSSProperties, useMemo } from 'react';

import { Form, FormItemProps } from 'antd';

import { AnyObject } from '@helpers/types';

import { InputMessage } from '@form/errorMessage/ErrorMessage';
import { FormLabel } from '@form/label/FormLabel';

export interface CustomFormItemProps<T = AnyObject> extends FormItemProps<T> {
  label?: string;
  link?: string;
  linkText?: string;
  help?: string;
  shouldAppendDefaultRules?: boolean;
  labelStyles?: CSSProperties;
}

const getRules = <T = AnyObject,>(
  rules: CustomFormItemProps<T>['rules'] = [],
) => {
  return rules.map((rule) => {
    if (typeof rule === 'function') {
      return rule;
    }

    return {
      ...rule,
      message:
        typeof rule.message === 'string' ? (
          <InputMessage message={rule.message} type={'danger'} />
        ) : (
          rule.message
        ),
    };
  });
};

export const CustomFormItem = <T = AnyObject,>(
  props: CustomFormItemProps<T>,
) => {
  const {
    label,
    link,
    linkText,
    rules,
    help,
    required,
    name,
    labelStyles,
    shouldAppendDefaultRules = true,
    ...otherProps
  } = props;

  const defaultRules = useMemo(() => {
    const inputName = label?.toLocaleLowerCase() || 'value';
    return [
      {
        required: required,
        message: `Please enter ${inputName}`,
      },
    ];
  }, [label, required]);

  return (
    <Form.Item<T>
      label={
        label && (
          <FormLabel
            style={labelStyles}
            label={label}
            link={link}
            linkText={linkText}
          />
        )
      }
      rules={[
        ...getRules(rules),
        ...(shouldAppendDefaultRules ? getRules(defaultRules) : []),
      ]}
      help={help && <InputMessage message={help} type={'secondary'} />}
      required={required}
      name={name}
      {...otherProps}
    />
  );
};

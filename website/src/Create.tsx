import * as React from 'react';
import { useState } from 'react';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';
import Result from './Result';
import { encryptMessage, postSecret, randomString } from './utils';
import { useTranslation } from 'react-i18next';

const Create = () => {
  const [expiration, setExpiration] = useState(604800);
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('');
  const [onetime, setOnetime] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uuid, setUUID] = useState('');
  const [password, setPassword] = useState('');

  const { t } = useTranslation();

  const submit = async () => {
    if (!secret) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      const pw = randomString();
      const { data, status } = await postSecret({
        expiration,
        message: await encryptMessage(secret, pw),
        one_time: onetime,
      });
      if (status !== 200) {
        setError(data.message);
      } else {
        setUUID(data.message);
        setPassword(pw);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="text-center">
      <h1>{t('Encrypt message')}</h1>
      <Error message={error} onClick={() => setError('')} />
      {uuid ? (
        <Result uuid={uuid} password={password} prefix="s" />
      ) : (
        <Form>
          <FormGroup>
            <Label>{t('Secret message')}</Label>
            <Input
              type="textarea"
              name="secret"
              rows="4"
              autoFocus={true}
              placeholder={t('Message to encrypt locally in your browser')}
              onChange={(e) => setSecret(e.target.value)}
              value={secret}
            />
          </FormGroup>
          <Lifetime expiration={expiration} setExpiration={setExpiration} />
          <OneTime setOnetime={setOnetime} onetime={onetime} />
          <Button
            disabled={loading}
            color="primary"
            size="lg"
            block={true}
            onClick={() => submit()}
          >
            {loading ? (
              <span>{t('Encrypting message...')}</span>
            ) : (
              <span>{t('Encrypt Message')}</span>
            )}
          </Button>
        </Form>
      )}
    </div>
  );
};

export const OneTime = (
  props: {
    readonly onetime: boolean;
    readonly setOnetime: React.Dispatch<React.SetStateAction<boolean>>;
  } & React.HTMLAttributes<HTMLElement>,
) => {
  const { t } = useTranslation();
  const { onetime, setOnetime } = props;
  return (
    <FormGroup>
      <Input
        type="checkbox"
        onChange={() => setOnetime(!onetime)}
        checked={onetime}
      />
      {t('One-time download')}
    </FormGroup>
  );
};
export const Lifetime = (
  props: {
    readonly expiration: number;
    readonly setExpiration: React.Dispatch<React.SetStateAction<number>>;
  } & React.HTMLAttributes<HTMLElement>,
) => {
  const { expiration, setExpiration } = props;
  const { t } = useTranslation();
  const buttons = [];
  for (const i of [
    {
      duration: 3600,
      name: '1h',
      text: t('One Hour'),
    },
    {
      duration: 86400,
      name: '1d',
      text: t('One Day'),
    },
    {
      duration: 604800,
      name: '1w',
      text: t('One Week'),
    },
  ]) {
    buttons.push(
      <FormGroup key={i.name} check={true} inline={true}>
        <Label check={true}>
          <Input
            type="radio"
            name={i.name}
            value={i.duration}
            onChange={(e) => setExpiration(+e.target.value)}
            checked={expiration === i.duration}
          />
          {i.text}
        </Label>
      </FormGroup>,
    );
  }

  return (
    <FormGroup tag="fieldset">
      <FormText color="muted">
        {t('The encrypted message will be deleted automatically after')}
      </FormText>
      {buttons}
    </FormGroup>
  );
};

export const Error = (
  props: { readonly message: string } & React.HTMLAttributes<HTMLElement>,
) =>
  props.message ? (
    <Alert color="danger" {...props}>
      {props.message}
    </Alert>
  ) : null;

export default Create;

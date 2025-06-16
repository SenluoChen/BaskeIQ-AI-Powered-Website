import { TFunction } from 'i18next';

export const CognitoErrorHandler = (err: Error, t: TFunction): string => {
  switch (err.name) {
  case 'UsernameExistsException':
    return t('error.errorUsernameAlreadyExist');
  case 'InvalidPasswordException':
    return t('error.errorBadPasswordFormat');
  case 'InvalidCodeException':
    return t('error.errorBadCode');
  case 'NotAuthorizedStatus':
    return t('error.errorBadStatus');
  case 'UserNotConfirmedException':
    return t('error.errorUserNotConfirmed');
  case 'NotAuthorizedException':
    return t('error.errorBadIdentification');
  case 'LimitExceededException':
    return t('error.errorLimitExceeded');
  default:
    return t('error.errorContactSupport');
  }
};

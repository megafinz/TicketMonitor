import { either, InputData, isDate, isIn, isString, minLength, required, Rule, validate, validateObject, ValidationRules } from '../deps/validation.ts';

function validateSearchCriteria(searchCriteriaJson: InputData): Rule {
  return either([
    validateObject(true, {
      type: [required, isString, isIn(['css-selector'])],
      selector: [required, isString, minLength(1)],
      child: searchCriteriaJson?.child ? validateSearchCriteria(searchCriteriaJson) : []
    }),
    validateObject(true, {
      type: [required, isString, isIn(['node-name'])],
      nodeName: [required, isString, minLength(1)],
      child: searchCriteriaJson?.child ? validateSearchCriteria(searchCriteriaJson) : []
    })
  ]);
}

function validateReport(): Rule {
  return either([
    validateObject(true, {
      type: [required, isString, isIn(['telegram'])],
      chatId: [required, isString, minLength(1)]
    })
  ]);
}

function getValidationRules(searchCriteriaJson: InputData): ValidationRules {
  return {
    description: [required, isString, minLength(1)],
    pageUrl: [required, isString, minLength(1)],
    expirationDate: [required, isDate],
    searchCriteria: validateSearchCriteria(searchCriteriaJson),
    report: validateReport()
  }
}

export function validateTicketMonitoringRequest(json: InputData) {
  return validate(json, getValidationRules(json));
}
import {
  genericCreateDataTestId,
  genericIsDataTestId,
  type GenericDataTestId,
} from '@session/testing/ids';
import { GenericTestingProps } from '@session/testing/react';

/** The base data test IDs for UI components. */
export enum BaseDataTestId {
  Button = 'button',
  Card = 'card',
  Command = 'command',
  Dialog = 'dialog',
  Popover = 'popover',
  Sonner = 'sonner',
}

/**
 * A data test ID used for identifying elements in UI components.
 * It can be either a generic data test ID or a base data test ID.
 */
export type DataTestId = GenericDataTestId<BaseDataTestId> | BaseDataTestId;

/**
 * The testing properties for a component.
 * @template BaseId The base data test ID type.
 */
export type TestingProps<BaseId extends BaseDataTestId> = GenericTestingProps<BaseId>;

/**
 * Checks if a given string is a valid data test ID.
 * @param dataTestId The string to be checked.
 * @returns A boolean indicating whether the string is a valid data test ID.
 */
export const isDataTestId = genericIsDataTestId<BaseDataTestId>;

/**
 * Creates a generic data test ID by combining a base data test ID and a test ID.
 * @param baseDataTestId The base data test ID.
 * @param testId The test ID.
 * @returns The generic data test ID.
 */
export const createDataTestId = genericCreateDataTestId<BaseDataTestId>;

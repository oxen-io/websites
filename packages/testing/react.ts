import { DataTestIdTag, GenericDataTestId } from './ids';

/**
 * The generic testing props for a React component.
 * @template DataTestId - The type of the data test ID.
 */
export type GenericTestingProps<DataTestId extends DataTestIdTag> = {
  /** The data test ID for the component. */
  'data-testid': GenericDataTestId<DataTestId>;
};

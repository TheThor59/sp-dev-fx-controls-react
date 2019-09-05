import * as React from 'react';

// Makes thingy pretty
import styles from './UploadFilePickerTab.module.scss';

// Needed for our custom pane tab
import { IUploadFilePickerTabProps, IUploadFilePickerTabState } from '.';

// Office Fabric to the rescue!
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/components/Button';

// Localization
import * as strings from 'ControlStrings';
import { IFilePickerResult } from '../FilePicker.types';
import { GeneralHelper } from '../../../common/utilities';

export default class UploadFilePickerTab extends React.Component<IUploadFilePickerTabProps, IUploadFilePickerTabState> {
  constructor(props: IUploadFilePickerTabProps) {
    super(props);
    this.state = {
      filePickerResult: undefined
    };
  }

  public render(): React.ReactElement<IUploadFilePickerTabProps> {
    const { filePickerResult } = this.state;
    const fileUrl: string = filePickerResult ? filePickerResult.fileAbsoluteUrl : null;
    const fileName: string = filePickerResult ? filePickerResult.fileTitle : null;

    // TODO: Display file content?
    return (
      <div className={styles.tabContainer}>
        <div className={styles.tabHeaderContainer}>
          <h2 className={styles.tabHeader}>{strings.UploadFileHeader}</h2>
        </div>
        <div className={styles.tab}>
          <input
            className={styles.localTabInput}
            type="file" id="fileInput"
            accept={this.props.accepts} multiple={false} onChange={(event: React.ChangeEvent<HTMLInputElement>) => this._handleFileUpload(event)}
          />
          {
            fileName &&
            <div className={styles.localTabSinglePreview}>
              {fileName}
              {/* <img className={styles.localTabSinglePreviewImage} src={fileUrl} alt={fileName} /> */}
            </div>
          }
          <label className={styles.localTabLabel} htmlFor="fileInput">{
            (fileName ? strings.ChangeFileLinkLabel : strings.ChooseFileLinkLabel)
          }</label>
        </div>
        <div className={styles.actionButtonsContainer}>
          <div className={styles.actionButtons}>
            <PrimaryButton
              disabled={fileUrl === undefined}
              onClick={() => this._handleSave()} className={styles.actionButton}>{strings.AddFileButtonLabel}</PrimaryButton>
            <DefaultButton onClick={() => this._handleClose()} className={styles.actionButton}>{strings.CancelButtonLabel}</DefaultButton>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Gets called when a file is uploaded
   */
  private _handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length < 1) {
      return;
    }

    // Get the files that were uploaded
    let files = event.target.files;

    // Grab the first file -- there should always only be one
    const file:File = files[0];

    const filePickerResult: IFilePickerResult = {
      file,
      fileAbsoluteUrl: null,
      fileTitle: GeneralHelper.getFileNameWithoutExtension(file.name)
    };
    // Convert to base64 image
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({
        filePickerResult
      });
    };
  }

  /**
   * Saves base64 encoded image back to property pane file picker
   */
  private _handleSave = () => {
    this.props.onSave(this.state.filePickerResult);
  }

  /**
   * Closes tab without saving
   */
  private _handleClose = () => {
    this.props.onClose();
  }
}

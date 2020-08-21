import StorageProvider from '@shared/container/providers/StorageProvider/models/StorageProvider';

class FakeStorageProvider implements StorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const foundIndex = this.storage.findIndex(
      (storageFile) => storageFile === file,
    );

    this.storage.splice(foundIndex, 1);
  }
}

export default FakeStorageProvider;

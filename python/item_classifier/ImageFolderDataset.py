from torch.utils.data import Dataset
import pandas as pd
from pathlib import Path
from PIL import Image
import glob

class ImageFolderDataset(Dataset):
    """Custom Dataset for loading data in the format of images in a folder and labels in a csv file.
    Args:
        csv_path (str): Path to the csv file containing the image filenames and their corresponding labels.
        folder_path (str): Path to the folder containing the images.
        label_column (str): Name of the column in the csv file containing the labels.
        file_type (str): File type of the images in the folder.
        transform (callable, optional): Optional transform to be applied on a sample.
    """
    def __init__(self, csv_path, folder_path, label_column, file_type=".jpg", transform=None):
        self.folder_path = Path(folder_path)
        self.file_type = file_type
        self.transform = transform

        self.df = pd.read_csv(csv_path)
        self.labels = self.df[label_column]
        self.classes = self.labels.unique()
		
    def load_image(self, index):
        """Get the image at the specified index. Assumes that the image filenames are stored in a column named 'id' in the csv file."""
        filename = self.df.iloc[index, 0]
        image_path = self.folder_path / (str(filename) + self.file_type)
        return Image.open(image_path)
    
    def class_index(self, index):
        """Return the index of the specified class label."""
        label = self.labels[index]
        class_index = {label: i for i, label in enumerate(self.classes)}
        return class_index[label]
    
    def __len__(self):
        """Return the number of images in the dataset."""
        return len(self.df)

    def __getitem__(self, index):
        """Return the image and its label at the specified index."""
        image = self.load_image(index)
        item_class = self.class_index(index)
        if self.transform:
            image = self.transform(image)
        return image, item_class

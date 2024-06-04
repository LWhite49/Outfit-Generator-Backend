
# given a link to an image, spits out an array of color label, percentage of pixels, hexadecimal value

import cv2 as cv
import numpy as np
import urllib.request
import rembg
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.neighbors import KNeighborsClassifier
from sklearn.cluster import AgglomerativeClustering

from conversions import rgb_to_hex
from n_groups import n_groups

IM_HEIGHT, IM_WIDTH = 150, 150

class ClothingDescriber():
    def __init__(self):
        self.km = KMeans(n_clusters=n_groups(), random_state=255, n_init='auto', tol=1e-6)
        self.sess = rembg.new_session('u2netp')
    def get_colors(self, url: str) -> list[list[str, float]]:
        '''Takes in an image url and returns its predominant color groups in order. Color grouping info has the hex value and percentage, in that order. Failures will return -1.'''
        # get the image data from the url
        response = urllib.request.urlopen(url)
        img = cv.imdecode(np.asarray(bytearray(response.read())), cv.IMREAD_COLOR)
        response.close()

        # reduce the image size 
        img = cv.resize(img, (IM_HEIGHT, IM_WIDTH))

        # change image to use rgb rather than bgr color space
        img = cv.cvtColor(img, cv.COLOR_BGR2RGB)

        # blur the image
        # img = cv.bilateralFilter(img, 10, 500, 25)

        # remove background
        img = rembg.remove(img, session=self.sess, bgcolor=(0,0,0,0))

        # cv.imshow('', img)
        # cv.waitKey()

        # flatten the image rows and columns
        img = np.reshape(img, (IM_HEIGHT*IM_WIDTH, -1))
        pre_img_size = img.size
        # find all pixels where the color alpha value is 0 and remove them
        img = np.delete(img, [i for i in range(IM_HEIGHT*IM_WIDTH) if img[i][3] == 0], axis=0)
        # drop alpha column from colors
        img = img[:, :3]

        # error correction for poor background removal
        if img.size < pre_img_size * 0.25:
            return -1

        # create a dataframe which will store all the colors labeled
        img_df = pd.DataFrame(img, columns=['Red', 'Green', 'Blue'])

        img_df['Label'] = self.km.fit_predict(img_df[['Red', 'Green', 'Blue']])
        
        labels = img_df['Label']
        centers = self.km.cluster_centers_

        # get color groups from image
        # labels = self.predictor.predict(img)

        # count pixels of each color
        votes = [0] * 4
        for i in range(len(labels)):
            votes[labels[i]] += 1
        
        colors_array = sorted([[rgb_to_hex(centers[i][0], centers[i][1], centers[i][2])[1:], votes[i]] for i in range(n_groups())], key=lambda x: x[1], reverse=True)

        total_px = sum(votes)
        for c in colors_array:
            c[1] /= total_px

        return colors_array

if __name__ == '__main__':
    cd = ClothingDescriber()
    # print(cd.get_colors('https://media-photos.depop.com/b1/34570605/1777087976_f762224765eb4cbcb728b9f58ba11978/P0.jpg'))
    # print(cd.get_colors('https://media-photos.depop.com/b1/29235888/1777365855_70ea0ea843e24453abbc993578db119c/P0.jpg'))
    # print(cd.get_colors('https://media-photos.depop.com/b1/44686826/1775473394_0a2ebcb4c0cd413eb05559f51cddbc4e/P0.jpg'))
    print(cd.get_colors('https://media-photos.depop.com/b1/16866238/1829720127_9092a94406c348889b28b0279471dc82/P0.jpg'))
    print(cd.get_colors('https://media-photos.depop.com/b1/31681508/1870822571_7ccd6d642ea44174ae33b204a83d0292/P8.jpg'))
    

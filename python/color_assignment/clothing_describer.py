
# given a link to an image, spits out an array of color label, percentage of pixels, hexadecimal value

import cv2 as cv
import numpy as np
import urllib.request
import rembg
from sklearn.cluster import AgglomerativeClustering
from color_model import ColorPredictor
from grouping.conversions import hex_to_rgb
from grouping.n_groups import n_groups
from grouping.cluster_access import get_hex

n_groups = n_groups()
IM_HEIGHT, IM_WIDTH = 150, 150

class ClothingDescriber():
    def __init__(self):
        self.predictor = ColorPredictor()
    def get_colors(self, url: str) -> list[list[int, float, str]]:
        '''Takes in an image url and returns its predominant color groups in order. Color grouping info has the label, its pixel percentage, and the label's hex, in that order. Failures will return -1.'''
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
        s = rembg.new_session('u2netp')
        img = rembg.remove(img, session=s, bgcolor=(0,0,0,0))

        # cv.imshow('', img)
        # cv.waitKey()

        # flatten the image rows and columns
        img = np.reshape(img, (IM_HEIGHT*IM_WIDTH, -1))
        pre_img_size = img.size
        # find all pixels where the color alpha value is 0 and remove them
        img = np.delete(img, [i for i in range(IM_HEIGHT*IM_WIDTH) if img[i][3] == 0], axis=0)
        # drop alpha column from colors
        img = img[:, :3]

        # return img.size / pre_img_size

        # error correction for poor background removal
        if img.size < pre_img_size * 0.25:
            return -1

        # get color groups from image
        labels = self.predictor.predict(img)

        # count pixels of each color
        votes = [0] * n_groups
        for i in range(len(labels)):
            votes[labels[i]] += 1

        # order groups by pixel count, only noting colors that take up more than 1%
        # list will contain label, pixel count, hex value
        prevalent = sorted([[i,x,get_hex(i)] for i, x in enumerate(votes) if x > img.size // 500], key=lambda x: x[1], reverse=True)

        # if there are more than 4 colors, compress down to four
        if len(prevalent) >= 4:
            cl = AgglomerativeClustering(n_clusters=4)
            labels = cl.fit_predict([hex_to_rgb(c[2]) for c in prevalent])
            
            compressed = []
            found = []
            for i in range(len(labels)):
                if labels[i] not in found:
                    compressed.append(prevalent[i])
                    found.append(labels[i])
        else:
            return -1
        
        # update pixel count to be a percentage instead
        total_px = 0
        for c in compressed:
            total_px += c[1]
        
        for c in compressed:
            c[1] /= total_px

        # return just groups
        return compressed

if __name__ == '__main__':
    cd = ClothingDescriber()
    # print(cd.get_colors('https://media-photos.depop.com/b1/34570605/1777087976_f762224765eb4cbcb728b9f58ba11978/P0.jpg'))
    # print(cd.get_colors('https://media-photos.depop.com/b1/29235888/1777365855_70ea0ea843e24453abbc993578db119c/P0.jpg'))
    # print(cd.get_colors('https://media-photos.depop.com/b1/44686826/1775473394_0a2ebcb4c0cd413eb05559f51cddbc4e/P0.jpg'))
    print(cd.get_colors('https://media-photos.depop.com/b1/16866238/1829720127_9092a94406c348889b28b0279471dc82/P0.jpg'))
    

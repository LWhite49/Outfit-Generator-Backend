from color_model import ColorPredictor
import cv2 as cv
import numpy as np
import urllib.request
import rembg

from grouping.n_groups import n_groups

n_groups = n_groups()
IM_HEIGHT, IM_WIDTH = 200, 200

def get_colors(url: str) -> list[list[int]]:
    '''Takes in an image url and returns its predominant color groups in order. Failures will return -1.'''
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

    # flatten the image rows and columns
    img = np.reshape(img, (IM_HEIGHT*IM_WIDTH, -1))
    # find all pixels where the color alpha value is 0 and remove them
    img = np.delete(img, [i for i in range(IM_HEIGHT*IM_WIDTH) if img[i][3] == 0], axis=0)
    # drop alpha column from colors
    img = img[:, :3]

    # get color groups from image
    m = ColorPredictor()
    labels = m.predict(img)

    # count pixels of each color
    votes = [0] * n_groups
    for i in range(len(labels)):
        votes[labels[i]] += 1

    # order groups by pixel count
    prevalent = sorted([[x,i] for i, x in enumerate(votes) if x > 50], reverse=True)

    # return just groups
    return [x[1] for x in prevalent]

# print(m.predict(img[0][0]))
# print(img[0][0])

# votes = m.predict(img)
# print(votes)
# for i in range(IM_HEIGHT):
#     for j in range(IM_WIDTH):
#         votes[m.predict(img[i][j])] += 1

# print(votes)
# for color in votes.keys():
#     print(votes[color] / max(votes.values()))

# response = urllib.request.urlopen('https://media-photos.depop.com/b1/34570605/1777087976_f762224765eb4cbcb728b9f58ba11978/P0.jpg')
    # response = urllib.request.urlopen('https://media-photos.depop.com/b1/29235888/1777365855_70ea0ea843e24453abbc993578db119c/P0.jpg')
    # response = urllib.request.urlopen('https://media-photos.depop.com/b1/44686826/1775473394_0a2ebcb4c0cd413eb05559f51cddbc4e/P0.jpg')
if __name__ == '__main__':
    print(get_colors('https://media-photos.depop.com/b1/29235888/1777365855_70ea0ea843e24453abbc993578db119c/P0.jpg'))
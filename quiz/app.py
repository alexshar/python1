import random
import xlwt

class GenQuiz:

    def __init__(self):
        self.item_list = []
        self.answer_list = []

    def append_item(self, num):
        for i in range(num):
            self.gen_item()

    def gen_item(self):
        template = random.randint(0,1)
        if template == 0:
            (answer, item) = self.gen_template0()
        elif template == 1:
            (answer, item) = self.gen_template1()
        else:
            answer = 2
            item = "1 + 1 ="
        self.answer_list.append(answer)
        self.item_list.append(item)

    def gen_template0(self):
        a = random.randint(2, 9)
        b = random.randint(3, 9)
        c = random.randint(2, 9)
        d = random.randint(3, 20)
        answer = int(a*b + c*d)
        item = "(%d x %d) + (%d x %d) =" % (a, b, c, d)
        return (answer, item)

    def gen_template1(self):
        a = random.randint(2, 10)
        b = random.randint(3, 9)
        c = random.randint(2, 9)
        d = random.randint(3, 20)
        e = a * b
        answer = int(e/b * (c+d))
        item = "(%d / %d) * (%d + %d) =" % (e, b, c, d)
        return (answer, item)

    def print_item_list(self):
        counter = 0
        for item in self.item_list:
            print(item, end="\t")
            counter = counter + 1
            if counter == 4:
                print('')
                counter = 0

    def export_excel(self, isAnswer=False, col_size=2, row_size=20):
        if col_size * row_size == 0:
            print('Neither column size nor row size could not be 0')
            return -1
        if len(self.item_list) <= 0:
            print('The not item generated for exporting')
            return -2
        # init 
        workbook = xlwt.Workbook()
        worksheet = None
        counter = 0
        page_size = col_size * row_size
        list_size = len(self.item_list)
        # set style
        font = xlwt.Font()
        font.height = 20*12
        font.bold = True
        style = xlwt.XFStyle()
        style.font = font
        # fill content
        while counter < list_size:
            # creating new sheet
            if counter % page_size == 0:
                sheet_sn = str(int(counter / page_size) + 1)
                worksheet = workbook.add_sheet(sheet_sn)
                worksheet.header_str = b''
                worksheet.footer_str = b''
                for k in range(col_size):
                    worksheet.col(k*3).width = 5000
                    worksheet.col(k*3+2).width = 4000
                worksheet.write(0, 0, "口算练习单第%s页" % sheet_sn, style)
                worksheet.write(2, 0, '姓名')
                worksheet.write(2, 2, '日期')
                worksheet.write(2, 4, '得分')
                worksheet.write(row_size * 2 + 9, col_size * 3 - 1 , 'p.'+sheet_sn)
            index = counter % page_size
            row_index = int(index / col_size) * 2 + 5
            col_index = (index % col_size) * 3
            worksheet.write(row_index, col_index, self.item_list[counter], style)
            worksheet.write(row_index, col_index+1, '_____')
            if isAnswer:
                worksheet.write(row_index, col_index+2, "[%s]" % self.answer_list[counter], style)
            counter = counter + 1
        #save
        if isAnswer:
            workbook.save('answer.xls')
        else:
            workbook.save('test.xls')

    def clear(self):
        self.item_list = []
        self.answer_list = []

if __name__ == "__main__":
    gen_quiz = GenQuiz()
    gen_quiz.append_item(25*40)
    gen_quiz.print_item_list()
    gen_quiz.export_excel()
    gen_quiz.export_excel(True)
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

describe('TasksService', () => {
  let service: TasksService;
  let repositoryMock: MockType<Repository<Task>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useFactory: jest.fn(() => ({
            findOneBy: jest.fn((entity) => entity),
            create: jest.fn((entity) => entity),
          })),
        },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
    repositoryMock = module.get(getRepositoryToken(Task));
  });

  describe('get Task By Id', () => {
    it('should find a Task', async () => {
      const task = {
        id: '696640a9-8976-4cd3-99a3-1d4d5d7660eb',
        title: 'Cleaning Room',
        description: 'Cleaning my room',
        status: TaskStatus.OPEN,
      };
      repositoryMock.findOneBy.mockReturnValue(task);
      expect(service.getTaskById(task.id, null)).toEqual(Promise.resolve(task));
      expect(repositoryMock.findOneBy).toBeCalledWith({
        id: task.id,
        user: null,
      });
    });

    it('should throw an error if task not found', async () => {
      repositoryMock.findOneBy.mockReturnValue(null);
      expect(
        service.getTaskById('696640a9-8976-4cd3-99a3-1d4d5d7660eb', null),
      ).rejects.toThrowError();
    });
  });
});

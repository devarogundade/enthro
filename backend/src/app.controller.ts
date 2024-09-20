/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './database/schemas/account';
import { Stream } from './database/schemas/stream';
import { Paged } from './types';
import { Video } from './database/schemas/video';
import { Channel } from './database/schemas/channel';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/create-account')
  createAccount(
    @Body() dto: Account
  ): Promise<Account | null> {
    return this.appService.createAccount(
      dto.address.toLocaleLowerCase(),
      dto.name,
      dto.email,
      dto.image
    );
  }

  @Post('/create-channel')
  createChannel(
    @Body() dto: Channel
  ): Promise<Channel | null> {
    return this.appService.createChannel(
      (dto.owner as string).toLocaleLowerCase(),
      dto.name,
      dto.image,
      dto.cover,
      dto.s_follow_amount
    );
  }

  @Post('/follow-account/:streamer/:viewer')
  followAccount(
    @Param('streamer') streamer: string,
    @Param('viewer') viewer: string
  ): Promise<boolean> {
    return this.appService.followAccount(
      streamer.toLocaleLowerCase(),
      viewer.toLocaleLowerCase(),
    );
  }

  @Post('/unfollow-account/:streamer/:viewer')
  unfollowAccount(
    @Param('streamer') streamer: string,
    @Param('viewer') viewer: string
  ): Promise<boolean> {
    return this.appService.unfollowAccount(
      streamer.toLocaleLowerCase(),
      viewer.toLocaleLowerCase(),
    );
  }

  @Post('/create-stream')
  createStream(
    @Body() dto: Stream
  ): Promise<Stream | null> {
    return this.appService.createStream(
      dto.streamAddress,
      (dto.streamer as string).toLocaleLowerCase(),
      dto.name,
      dto.description,
      dto.thetaId,
      dto.stream_server,
      dto.stream_key,
      dto.thumbnail,
      dto.visibility,
      dto.streamType,
      dto.tips,
      dto.start_at,
    );
  }

  @Post('/start-stream/:streamAddress')
  startStream(
    @Param('streamAddress') streamAddress: string,
    @Query('streamServer') streamServer: string,
    @Query('streamKey') streamKey: string
  ): Promise<boolean> {
    return this.appService.updateStream(
      streamAddress, streamServer, streamKey
    );
  }

  @Post('/end-stream/:streamAddress')
  endStream(
    @Param('streamAddress') streamAddress: string
  ): Promise<boolean> {
    return this.appService.endStream(
      streamAddress
    );
  }

  @Post('/join-stream/:viewer/:streamAddress')
  joinStream(
    @Param('viewer') viewer: string,
    @Param('streamAddress') streamAddress: string
  ): Promise<boolean> {
    return this.appService.joinStream(
      viewer.toLocaleLowerCase(),
      streamAddress,
    );
  }

  @Post('/upload-video')
  uploadVideo(
    @Body() dto: Video
  ): Promise<Video | null> {
    return this.appService.uploadVideo(
      dto.videoAddress,
      (dto.streamer as string).toLocaleLowerCase(),
      dto.name,
      dto.description,
      dto.thumbnail,
      dto.visibility,
      dto.thetaId,
      dto.tips
    );
  }

  @Post('/watch-video/:viewer/:videoAddress')
  watchVideo(
    @Param('viewer') viewer: string,
    @Param('videoAddress') videoAddress: string
  ): Promise<boolean> {
    return this.appService.watchVideo(
      viewer.toLocaleLowerCase(),
      videoAddress,
    );
  }

  @Post('/like-stream/:viewer/:streamAddress')
  likeStream(
    @Param('viewer') viewer: string,
    @Param('streamAddress') streamAddress: string
  ): Promise<boolean> {
    return this.appService.likeStream(
      viewer.toLocaleLowerCase(),
      streamAddress,
    );
  }

  @Post('/like-video/:viewer/:videoAddress')
  likeVideo(
    @Param('viewer') viewer: string,
    @Param('videoAddress') videoAddress: string
  ): Promise<boolean> {
    return this.appService.likeVideo(
      viewer.toLocaleLowerCase(),
      videoAddress,
    );
  }

  @Post('/dislike-stream/:viewer/:streamAddress')
  dislikeStream(
    @Param('viewer') viewer: string,
    @Param('streamAddress') streamAddress: string
  ): Promise<boolean> {
    return this.appService.dislikeStream(
      viewer.toLocaleLowerCase(),
      streamAddress,
    );
  }

  @Post('/dislike-video/:viewer/:videoAddress')
  dislikeVideo(
    @Param('viewer') viewer: string,
    @Param('videoAddress') videoAddress: string
  ): Promise<boolean> {
    return this.appService.dislikeVideo(
      viewer.toLocaleLowerCase(),
      videoAddress,
    );
  }

  @Get('/streams')
  getStreams(
    @Query('page') page: number,
    @Query('streamer') address: string | null
  ): Promise<Paged<Stream[]> | null> {
    return this.appService.getStreams(
      page,
      address.toLocaleLowerCase(),
    );
  }

  @Get('/streams/:id')
  getStream(
    @Param('id') streamAddress: string,
  ): Promise<Stream | null> {
    return this.appService.getStream(
      streamAddress
    );
  }

  @Get('/videos')
  getVideos(
    @Query('page') page: number,
    @Query('streamer') address: string | null
  ): Promise<Paged<Video[]> | null> {
    return this.appService.getVideos(
      page,
      address.toLocaleLowerCase(),
    );
  }

  @Get('/videos/:id')
  getVideo(
    @Param('id') videoAddress: string,
  ): Promise<Video | null> {
    return this.appService.getVideo(
      videoAddress
    );
  }

  @Get('/accounts/:id')
  getAccount(
    @Param('id') address: string,
  ): Promise<Account | null> {
    return this.appService.getAccount(
      address.toLocaleLowerCase()
    );
  }

  @Get('/channels')
  getChannels(
    @Query('page') page: number
  ): Promise<Paged<Channel[]> | null> {
    return this.appService.getChannels(page);
  }

  @Get('/channels/:id')
  getChannel(
    @Param('id') address: string,
  ): Promise<Channel | null> {
    return this.appService.getChannel(
      address.toLocaleLowerCase()
    );
  }
}

/* eslint-disable import/prefer-default-export */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/db/supabase/client';

import crawler from './crawler';

// submit table empty -> stop

// filter status
// isFeature (priority)
// time order

// when crawler is done
// insert web_nav table (tags <- tags[0] or 'other')
// update submit table status

export async function POST(req: NextRequest) {
  try {
    // 获取请求头中的 Authorization
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization Header:', authHeader); // 调试日志

    // 检查 Authorization 是否存在并验证 token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Authorization header is missing or malformed');
      return NextResponse.json({ error: 'Authorization header is missing or malformed' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const cronKey = process.env.CRON_AUTH_KEY;
    const isValid = cronKey === token;
    if (!isValid) {
      console.error('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const supabase = createClient();

    console.log('supabase connected!');

    const [{ data: categoryList, error: categoryListError }, { data: submitList, error: submitListError }] =
      await Promise.all([
        supabase.from('navigation_category').select(),
        supabase
          .from('submit')
          .select()
          .eq('status', 0)
          .order('is_feature', { ascending: false })
          .order('created_at', { ascending: true }),
      ]);

    console.log('supabase get categoryList succeed!');
    if (categoryListError || !categoryList) {
      return NextResponse.json({ error: 'Category is null' }, { status: 201 });
    }

    if (submitListError || !submitList || !submitList[0]) {
      return NextResponse.json({ error: 'Submit list is null' }, { status: 202 });
    }
    console.log('supabase get submitList succeed!');

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cron_callback`;

    const firstSubmitData = submitList[0];
    const res = await crawler({
      url: firstSubmitData.url!,
      tags: categoryList!.map((item) => item.name),
      callback_url: callbackUrl,
      key: cronKey,
    });

    console.log('api get crawler succeed!');

    if (res.code !== 200) {
      throw new Error(res.msg);
    }
    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Error in POST:', error); // 捕获并记录错误
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = `Bearer ${process.env.CRON_AUTH_KEY}`;
    const simulatedReq = new NextRequest(req.url, {
      method: 'POST',
      headers: {
        ...req.headers,
        Authorization: authHeader,
      },
    });

    // 调试日志
    console.log('Simulated Request:', simulatedReq);

    // 直接调用 POST 方法的逻辑
    return await POST(simulatedReq);
  } catch (error) {
    console.error('Error in GET:', error); // 捕获并记录错误
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
